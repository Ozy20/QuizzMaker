const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
const config = require("config")

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String, enum: ["teacher", "user"], default: "teacher" },
    createdQuizzes: [{ quizzId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }, quizTitle: { type: String } }], //for teachers
    attemptedQuizzes: [{ quizzId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" } }], //for users
});

userSchema.method("genAuthToken", function () {
    const token = jwt.sign({ _id: this._id, userName: this.userName, userRole: this.userRole }, config.get("jwtsec"))
    return token;
});

const User = mongoose.model("User", userSchema);
module.exports = User;