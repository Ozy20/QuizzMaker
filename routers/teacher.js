const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const verifyToken = require('../middlewares/verifyTokenMW');

router.get('/myQuizzes', verifyToken, teacherController.getAllQuizzes);
router.get('/myQuizzes/:quizId', verifyToken, teacherController.getQuizById);
router.post('/createQuiz', verifyToken, teacherController.createQuiz);
router.put('/modifyQuiz/:quizId', verifyToken, teacherController.modifyQuiz);
router.delete('/deleteQuiz/:quizId', verifyToken, teacherController.deleteQuiz);

module.exports = router;