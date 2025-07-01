const mongoose = require('mongoose');
const attemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
            answer: { type: String, required: true }
        }
    ],
    score: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now }
});
const Attempt = mongoose.model("Attempt", attemptSchema);
module.exports = Attempt;