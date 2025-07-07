const express = require("express")
const router = express.Router();
const verifyToken = require('../middlewares/verifyTokenMW');
const studentController = require("../controllers/studentController")

router.get("/AllQuizzes",verifyToken,studentController.getAllQuizzes)
router.get("/quiz/:quizId",verifyToken,studentController.getSingleQuiz)
router.get("/startQuiz/:quizId",verifyToken,studentController.startQuiz)
router.get('/getQuizAttempt/:quizId', verifyToken, studentController.getQuizAttempt);
router.post("/submitAnswers/:quizId",verifyToken,studentController.submitAnswers)



module.exports = router;