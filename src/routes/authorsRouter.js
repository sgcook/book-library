const express = require("express");
const authorsController = require("../controllers/authors");

const router = express.Router();

router.post("/", authorsController.create);
router.get("/", authorsController.readAll);
router.get("/:authorId", authorsController.readById);
router.patch("/:authorId", authorsController.update);
router.delete("/:authorId", authorsController.destroy);

module.exports = router;