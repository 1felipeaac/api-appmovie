class UserRepositoryInMemory{
    user = []

    async create({email, name, password}){
        const user = {
            id: Math.floor(Math.random() * 1000) + 1,
            email,
            name,
            password
        }

        this.user.push(user)

        return user
    }

    async findByEmail(email){
            return this.user.find(user => user.email === email)
        }
}

module.exports = UserRepositoryInMemory