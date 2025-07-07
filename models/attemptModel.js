const mongoose = require('mongoose');
const attemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    answers: [
        {
            questionId: { type: String },
            answer: { type: String },
        }
    ],
    score: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now },
    availTill:{type: Date ,required: true}
});
const Attempt = mongoose.model("Attempt", attemptSchema);
module.exports = Attempt;