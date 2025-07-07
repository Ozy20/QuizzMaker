const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const mongoose = require('mongoose');

const createQuiz = async (req, res) => {

    try {
        const creatorId = req.user._id;
        const creator = await User.findById(creatorId);

        if (!creator) {
            return res.status(404).json({ message: "Creator not found" });
        }
        if (creator.userRole !== 'teacher') {
            return res.status(403).json({ message: "Only teachers can create quizzes" });
        }

        const { title, subject, description, mcqQuestions, freeTextQuestions, quizDuration } = req.body;

        if (!title || !subject) {
            return res.status(400).json({ message: "Title and subject are required" });
        }
        if ((!mcqQuestions && !freeTextQuestions) || (mcqQuestions.length === 0 && freeTextQuestions.length === 0)) {
            return res.status(400).json({ message: "At least one type of question is required" });
        }
        if (!quizDuration || quizDuration <= 0) {
            return res.status(400).json({ message: "Quiz duration must be provided" });
        }
        const questionsType = mcqQuestions && freeTextQuestions ? "both" : (mcqQuestions ? "mcq" : "freeText");
        const numberOfQuestions = (mcqQuestions ? mcqQuestions.length : 0) + (freeTextQuestions ? freeTextQuestions.length : 0);

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const newQuiz = new Quiz({
                title,
                subject,
                description,
                createdBy: creatorId,
                mcqQuestions: mcqQuestions,
                freeTextQuestions: freeTextQuestions,
                qustionsType: questionsType,
                numberOfQuestions,
                quizDuration,
                createdAt: new Date()
            });
            const savedQuiz = await newQuiz.save({ session });
            await User.updateOne(
                { _id: creatorId },
                { $push: { createdQuizzes: { quizzId: savedQuiz._id, quizTitle: savedQuiz.title } } },
                { session }
            );
            await session.commitTransaction();
            session.endSession();
            return res.status(201).json({ message: "Quiz created successfully", quiz: savedQuiz });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    catch (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ message: "Error creating quiz:" });
    }

};


const getAllQuizzes = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const quizzes = await Quiz.find({ createdBy: teacherId }).select('_id title subject description createdAt');
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found for this teacher" });
        }
        return res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return res.status(500).json({ message: "Error fetching quizzes" });
    }
};
const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.user._id }).select('-createdBy');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        return res.status(200).json({data:quiz});
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({ message: "Error fetching quiz" });
    }
};

const modifyQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { title, subject, description, mcqQuestions, freeTextQuestions, quizDuration } = req.body;
        const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.user._id });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found or you do not have permission to modify it" });
        }

        let titleChanged = false;
        if (title !== undefined && title !== quiz.title) {
            quiz.title = title;
            titleChanged = true;
        }
        if (subject !== undefined) quiz.subject = subject;
        if (description !== undefined) quiz.description = description;
        if (mcqQuestions !== undefined) quiz.mcqQuestions = mcqQuestions;
        if (freeTextQuestions !== undefined) quiz.freeTextQuestions = freeTextQuestions;
        if (quizDuration !== undefined) quiz.quizDuration = quizDuration;

        const questionsType = (quiz.mcqQuestions.length && quiz.freeTextQuestions.length)
            ? "both"
            : (quiz.mcqQuestions.length ? "mcq" : "freeText");
        const numberOfQuestions = quiz.mcqQuestions.length + quiz.freeTextQuestions.length;
        quiz.qustionsType = questionsType;
        quiz.numberOfQuestions = numberOfQuestions;

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedQuiz = await quiz.save({ session });

            if (titleChanged) {
                await User.updateOne(
                    { _id: req.user._id, "createdQuizzes.quizzId": quizId },
                    { $set: { "createdQuizzes.$.quizTitle": title } },
                    { session }
                );
            }

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ message: "Quiz modified successfully", quiz: updatedQuiz });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error modifying quiz:", error);
            return res.status(500).json({ message: "Error modifying quiz" });
        }
    } catch (error) {
        console.error("Error modifying quiz:", error);
        return res.status(500).json({ message: "Error modifying quiz" });
    }
};

const deleteQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findOne({ _id: quizId, createdBy: req.user._id });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found or you do not have permission to delete it" });
        }
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await Quiz.deleteOne({ _id: quizId, createdBy: req.user._id }, { session });
            await User.findByIdAndUpdate(
                req.user._id,
                { $pull: { quizzesCreated: quizId } },
                { session, new: true }
            );
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Quiz deleted successfully" });
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error deleting quiz:", error);
            return res.status(500).json({ message: "Error deleting quiz" });
        }
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return res.status(500).json({ message: "Error deleting quiz" });
    }
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    modifyQuiz,
    deleteQuiz

};
