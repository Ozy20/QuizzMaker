const express = require("express")
const router = express.Router();
const verifyToken = require('../middlewares/verifyTokenMW');
const studentController = require("../controllers/studentController")

router.get("/AllQuizzes",verifyToken,studentController.getAllQuizzes)


module.exports = router;