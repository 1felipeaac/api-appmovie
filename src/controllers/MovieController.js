const knex = require("../database/knex");

class MovieController{
    async create(request, response){
        const {title, description, rating, tags} = request.body;
        const user_id = request.user.id;

        const [movie_id] = await knex("movies").insert({
            title, 
            description, 
            rating, 
            user_id
        });

        const tagsInsert = tags.map(name =>{
            return{
                name,
                movie_id,
                user_id
            }
        })

        await knex("tags").insert(tagsInsert);

        return response.json({title, rating, description, tags});

    }

    async show(request, response){
        const {id} = request.params;

        const movie = await knex("movies").where({id}).first();
        const tags = await knex("tags").where({movie_id: id}).orderBy("name");

        console.log(tags)

        return response.json({
            ...movie,
            tags
        });
    }

    async delete(request, response){
        const {id} = request.params;

        await knex("movies").where({id}).delete();

        return response.json();

    }

    async index(request, response){
        const {title, tags} = request.query;
    
        const user_id = request.user.id;

        let movies;

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim());
            
            movies = await knex("tags")
            .select([
                "movies.id",
                "movies.title",
                "movies.user_id"
            ])
            .where("movies.user_id", user_id)
            .whereLike("title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("movies", "movies.id", "tags.movie_id")
            .groupBy("movies.id")
            .orderBy("movies.title")
            
        }else{
            movies = await knex("movies")
            .select([
                "movies.id",
                "movies.title",
                "movies.description",
                "movies.user_id"
            ])
            .where({user_id})
            .whereLike("title", `%${title}%`)
            .orderBy("title")
        } 

        const userTags = await knex("tags").where({user_id});
        const moviesWithTags = movies.map(movie =>{
                const movieTags = userTags.filter(tag => tag.movie_id === movie.id);
                
                return {
                    ...movie,
                    tags: movieTags
                }
            });
        return response.json(moviesWithTags)
    }

    async update(request, response) {
        const { id } = request.params;
        const { title, description, rating, tags } = request.body;
        const user_id = request.user.id;
    
        // Atualiza os dados do filme na tabela 'movies'
        await knex("movies").where({ id }).update({
          title,
          description,
          rating,
          user_id,
        });
    
        // Remove as tags existentes do filme na tabela 'tags'
        await knex("tags").where({ movie_id: id }).delete();
    
        // Insere as novas tags na tabela 'tags'
        const tagsInsert = tags.map((name) => {
          return {
            name,
            movie_id: id,
            user_id,
          };
        });
    
        await knex("tags").insert(tagsInsert);
    
        return response.json({
          id,
          title,
          description,
          rating,
          tags,
        });
      }
}

module.exports = MovieController;