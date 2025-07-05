const User = require('../models/userModel');
const Quiz = require('../models/quizModel');
const Attempt = require('../models/attemptModel');
const mongoose = require('mongoose');

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = Quiz.find().select("title subject description ");
        if (!quizzes || quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found for this teacher" });
        }
        return res.status(200).json(quizzes);
    }
    catch (error) {
        console.error("Error modifying quiz:", error);
        return res.status(500).json({ message: "Error modifying quiz" });
    }
}

module.exports = {
    getAllQuizzes
}