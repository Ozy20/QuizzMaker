import React, { useState ,useEffect} from 'react';
import "./quizAttempt.css"
import { useParams } from 'react-router-dom';
import startQuiz from '../../services/startQuiz';
import { jwtDecode } from 'jwt-decode';
const QuizAttempt = () => {
    const [error,setError]=useState('')
    const [quizData,setQuizData]=useState({});
    const [mcqAnswers, setMcqAnswers] = useState({});
    const [freeTextAnswers, setFreeTextAnswers] = useState({});
    const quizId = useParams();
    const token = localStorage.getItem("token")
    const [userRole,setUserRole]=useState("student")
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.userRole || 'student';
                setUserRole(role);
            } catch (error) {
                console.error('Error decoding token:', error);
                setError('Invalid token');
            }
        }
    }, [token]);

    const handleMCQAnswer = (questionId, selectedOption) => {
        setMcqAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleFreeTextAnswer = (questionId, answer) => {
        setFreeTextAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = () => {
        const allAnswers = {
            mcqAnswers,
            freeTextAnswers
        };

        console.log('All Answers:', allAnswers);

        const formattedAnswers = [
            ...Object.entries(mcqAnswers).map(([questionId, answer]) => ({
                questionId,
                answer: answer.toString()
            })),
            ...Object.entries(freeTextAnswers).map(([questionId, answer]) => ({
                questionId,
                answer: answer.toString()
            }))
        ];

        console.log('Formatted Answers for API:', formattedAnswers);
        alert('Quiz submitted! Check console for answer data.');
    };

    return (
        <div className="quiz-container">
            <div className="quiz-info-container">
                <h1 className="info">{quizData.title}</h1>
                <p className="info">Subject: <span className="font-semibold">{quizData.subject}</span></p>
                <p cclassName="info">Description: {quizData.description}</p>
                <p className="info">Duration: <span className="font-semibold">{quizData.quizDuration} minutes</span></p>
            </div>

            {quizData.mcqQuestions && quizData.mcqQuestions.length > 0 && (
                <div className="mcq-container">
                    <h2 className="mcq-title">
                        Multiple Choice Questions
                    </h2>

                    {quizData.mcqQuestions.map((question, index) => (
                        <div key={question._id} className="">
                            <h3 className="">
                                Question {index + 1}: {question.question}
                            </h3>
                            <p className="">Marks: {question.marks}</p>

                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <label
                                        key={option._id}
                                        className=""
                                    >
                                        <input
                                            type="radio"
                                            name={`mcq-${question._id}`}
                                            value={option.option}
                                            checked={mcqAnswers[question._id] === option.option}
                                            onChange={() => handleMCQAnswer(question._id, option.option)}
                                            className=""
                                        />
                                        <span className="">{option.option}</span>
                                    </label>
                                ))}
                            </div>

                            {mcqAnswers[question._id] && (
                                <div className="">
                                    Selected: {mcqAnswers[question._id]}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {quizData.freeTextQuestions && quizData.freeTextQuestions.length > 0 && (
                <div className="">
                    <h2 className="">
                        Free Text Questions
                    </h2>

                    {quizData.freeTextQuestions.map((question, index) => (
                        <div key={question._id} className="">
                            <h3 className="">
                                Question {(quizData.mcqQuestions?.length || 0) + index + 1}: {question.question}
                            </h3>
                            <p className="">Marks: {question.marks}</p>

                            <textarea
                                value={freeTextAnswers[question._id] || ''}
                                onChange={(e) => handleFreeTextAnswer(question._id, e.target.value)}
                                placeholder="Type your answer here..."
                                className=""
                            />

                            {freeTextAnswers[question._id] && (
                                <div className="">
                                    Characters: {freeTextAnswers[question._id].length}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="">
                <button
                    onClick={handleSubmit}
                    className=""
                >
                    Submit Quiz
                </button>
            </div>

        </div>
    );
};

export default QuizAttempt;