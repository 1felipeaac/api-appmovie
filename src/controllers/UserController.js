const {hash, compare} = require("bcryptjs")
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

const UserRepository = require("../repositories/UserRepository")
const UserCreateService = require("../services/UserCreateService")

class UserController{

    async create(request, response){
        const {name, email, password} = request.body;

        const userRepository = new UserRepository()

        const userCreateService = new UserCreateService(userRepository)

        await userCreateService.execute({name: name, email: email, password: password})

        // const checkUserExists = await userRepository.findByEmail(email)

        // if(checkUserExists){
        //     throw new AppError("Este e-mail já está em uso");
        // }

        // const hashedPassword = await hash(password, 8);

        // await userRepository.create({name, email, password: hashedPassword})

        return response.status(201).json()

    }

    async update(request, response){
        const {name, email, password, old_password} = request.body;
        const user_id = request.user.id;

        const userRepository = new UserRepository()

        // const database = await sqliteConnection();
        // const user = = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
        const user = await userRepository.findByUser(user_id)

        if(!user){
            throw new AppError("Usuário não encontrado")
        }

        // const userWithUpdatedEmail = await database.get("SELECT * FROM  users WHERE email = (?)", [email]);
        const userWithUpdatedEmail = await userRepository.findByEmail(email)

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este email já está em uso.");
        }

        user.name = name ?? user.name; // '??' = nullish operator
        user.email = email ?? user.email;

        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
        }

        if(password && old_password){
            const checkPassword = await compare(old_password, user.password);

            if(!checkPassword){
                throw new AppError("Senha antiga não confere.");
            }

            user.password = await hash(password, 8)
        }

        // await database.run(`
        //     UPDATE users SET
        //     name = (?),
        //     email = (?),
        //     password = (?),
        //     updated_at = DATETIME('now')
        //     WHERE id = (?)`,
        //     [user.name, user.email, user.password, user_id]
        //     );
        userRepository.update(user.name, user.email, user.password, user_id)

        return response.status(200).json();
    }

}

module.exports = UserController;