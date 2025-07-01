const mongoose = require('mongoose');
const quizzSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mcqQuestions: [
        {
            question: { type: String, required: true },
            options: [
                { option: { type: String, required: true }, isCorrect: { type: Boolean, default: false } }
            ],
            marks: { type: Number, default: 1 }
        }
    ],
    freeTextQuestions: [
        {
            question: { type: String, required: true },
            answer: { type: String, required: true },
            marks: { type: Number, default: 1 }
        }
    ]
    ,
    qustionsType: { type: String, enum: ["mcq", "freeText", "both"], default: "mcq" },
    numberOfQuestions: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },

});
const Quiz = mongoose.model("Quiz", quizzSchema);
module.exports = Quiz;