const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const Attempt = require('../models/attemptModel');
const mongoose = require('mongoose');

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().select("_id title subject description createdAt");
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found for this teacher" });
        }
        return res.status(200).json(quizzes);
    }
    catch (error) {
        console.error("Error getting quiz:", error);
        return res.status(500).json({ message: "Error getting quiz" });
    }
}
const getSingleQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findOne({ _id: quizId }).select("-freeTextQuestions -mcqQuestions").populate({
            path: 'createdBy',
            select: 'name userName'
        });;
        console.log(quiz)
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        return res.status(200).json({ data: quiz });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({ message: "Error fetching quiz" });
    }
}

const startQuiz = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const quizId = req.params.quizId;
        const userId = req.user._id;

        const quiz = await Quiz.findOne({_id:quizId}).session(session);
        if (!quiz) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Quiz not found." });
        }
        const now = new Date();
        const quizDuration = quiz.duration || 60;
        const availTill = new Date(now.getTime() + quizDuration * 60 * 1000);

        const existingAttempt = await Attempt.findOne({
            userId: userId,
            quizId: quizId,
        }).session(session);

        if (existingAttempt) {
            if (existingAttempt.availTill && existingAttempt.availTill > new Date()) {
                await session.commitTransaction();
                return res.status(200).json({
                    message: "Resuming existing quiz attempt.",
                    attemptId: existingAttempt._id,
                    availTill: existingAttempt.availTill
                });
            } else {
                await session.abortTransaction();
                return res.status(403).json({ message: "You cannot attempt this quiz again as your previous attempt has expired or is invalid." });
            }
        }

        const newAttempt = new Attempt({
            userId: userId,
            quizId: quizId,
            answers: [],
            score: 0,
            availTill: availTill
        });

        await newAttempt.save({ session });

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { attemptedQuizzes: { quizId: quizId } } },
            { new: true, session: session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            message: "Quiz started successfully.",
            attemptId: newAttempt._id,
            availTill: newAttempt.availTill
        });

    }
    catch (error) {
        await session.abortTransaction();
        console.log("Error while starting the quiz", error);
        return res.status(500).json({ message: "Error starting quiz" });
    } finally {
        session.endSession();
    }
}


const submitAnswers = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user._id;
        const submittedAnswers = req.body.answers;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        const attempt = await Attempt.findOne({ userId, quizId });
        if (!attempt) {
            return res.status(403).json({ message: "You haven't started this quiz." });
        }

        if (attempt.availTill < new Date()) {
            return res.status(403).json({ message: "Time is up. You cannot submit this quiz anymore." });
        }

        let score = 0;
        const storedAnswers = [];

        for (const { questionId, answer } of submittedAnswers) {
            let isCorrect = false;

            const mcq = quiz.mcqQuestions.find(q => q._id.toString() === questionId);
            if (mcq) {
                const correctOption = mcq.options.find(opt => opt.isCorrect);
                if (
                    correctOption &&
                    correctOption.option.trim().toLowerCase() === answer.trim().toLowerCase()
               ) {
                    score += mcq.marks || 1;
                    isCorrect = true;
                }
            }

            const ftq = quiz.freeTextQuestions.find(q => q._id.toString() === questionId);
            if (ftq) {
                if (ftq.answer.trim().toLowerCase() === answer.trim().toLowerCase()) {
                    score += ftq.marks || 1;
                    isCorrect = true;
                }
            }

            storedAnswers.push({ questionId, answer });
        }

        attempt.answers = storedAnswers;
        attempt.score = score;
        await attempt.save();

        return res.status(200).json({
            message: "Answers submitted successfully.",
            score,
        });
    } catch (error) {
        console.error("Error submitting answers:", error);
        return res.status(500).json({ message: "Error submitting answers." });
    }
};



module.exports = {
    getAllQuizzes,
    getSingleQuiz,
    startQuiz,
    submitAnswers
}