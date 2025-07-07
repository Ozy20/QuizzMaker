const express = require("express")
const router = express.Router();
const verifyToken = require('../middlewares/verifyTokenMW');
const studentController = require("../controllers/studentController")

router.get("/AllQuizzes",verifyToken,studentController.getAllQuizzes)
router.get("/quiz/:quizId",verifyToken,studentController.getSingleQuiz)


module.exports = router;