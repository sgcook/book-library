const express = require("express");
const readersController = require("../controllers/readers");

const router = express.Router();

router.post("/", readersController.create);
router.get("/", readersController.readAll);
router.get("/:readerId", readersController.readById);
router.patch("/:readerId", readersController.update);
router.delete("/:readerId", readersController.destroy);

module.exports = router;