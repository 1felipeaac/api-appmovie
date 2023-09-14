const { Router } = require ("express");

const TagController = require("../controllers/TagsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");


const tagRoutes = Router();

const tagsController = new TagController();

tagRoutes.get("/", ensureAuthenticated ,tagsController.index);

module.exports = tagRoutes;