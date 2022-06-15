const express = require("express");
const genresController = require("../controllers/genres");

const router = express.Router();

router.post("/", genresController.create);
router.get("/", genresController.readAll);
router.get("/:genreId", genresController.readById);
router.patch("/:genreId", genresController.update);
router.delete("/:genreId", genresController.destroy);

module.exports = router;