const { Router } = require ("express");

const MovieController = require("../controllers/MovieController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieRoutes = Router();

const moviesController = new MovieController();

movieRoutes.use(ensureAuthenticated);

movieRoutes.get("/", moviesController.index);
movieRoutes.post("/", moviesController.create);
movieRoutes.get("/:id", moviesController.show);
movieRoutes.delete("/:id", moviesController.delete);
movieRoutes.put("/:id", moviesController.update);

module.exports = movieRoutes;