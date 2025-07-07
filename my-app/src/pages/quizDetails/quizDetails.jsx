import { useState, useEffect } from "react";
import getQuizDetails from "../../services/getQuizDetails";
import { jwtDecode } from "jwt-decode";
//import { MCQQuestion, FreeTextQuestion } from "../../components/questions/questions"
import { useParams } from "react-router-dom";
import "./quizDetails.css"
import startQuiz from "../../services/startQuiz";
import { useNavigate } from "react-router-dom";

const QuizDetails = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const [userRole, setUserRole] = useState("")
    const [mcqs, setMcqs] = useState([])
    const [fts, setFts] = useState([])
    const { quizId } = useParams()
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!userRole || !quizId) return;
            try {
                setLoading(true);
                setError("");
                const response = await getQuizDetails(userRole, token, quizId);
                if (response.success === true) {
                    const quiz = response.data;
                    setData(quiz);
                    setMcqs(Array.isArray(quiz.mcqQuestions) ? quiz.mcqQuestions : []);
                    setFts(Array.isArray(quiz.freeTextQuestions) ? quiz.freeTextQuestions : []);
                } else {
                    setError(response.message || "failed to fetch the quiz");
                }
            }
            catch (error) {
                setError(error.message || "An error occurred");
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchQuiz();
    }, [token, userRole, quizId])

    useEffect(() => {
        console.log("Updated data:", data);
        console.log("Updated mcqs:", mcqs);
        console.log("Updated fts:", fts);
    }, [data, mcqs, fts]);

    const handelStartQuiz = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await startQuiz(userRole, token, quizId);
            
            if (response.success === true) {
                navigate(`/attemptQuiz/${quizId}`);
            } else {
                const errorMessage = response.message || response.error || "Failed to start quiz";
                setError(errorMessage);
            }
        }
        catch (error) {
            setError(error.message);
            console.error("Error starting quiz:", error);
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div>Loading quiz details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        userRole === "teacher" ? (
            <div className="details-container">
                <div className="quiz-title">Quiz title: {data.title}</div>
                <div className="quiz-subject">Subject: {data.subject}</div>
                <div className="quiz-description">Description: {data.description}</div>
                <div className="quiz-duration">Quiz Duration: {data.quizDuration} mins</div>
                <div className="created-at">{data.createdAt}</div>
                <div className="questions-list">
                    {mcqs.length > 0 ? (
                        mcqs.map((mcq, idx) => (
                            <div key={idx}>
                                <strong>{mcq.question}</strong>
                                <ul>
                                    {mcq.options.map((opt, i) => (
                                        <li key={i}>{opt.option} {opt.isCorrect ? "(✔️)" : ""}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div>No MCQ added yet</div>
                    )}

                    {fts.length > 0 ? (
                        fts.map((ft, idx) => (
                            <div key={idx}>
                                <strong>{ft.question}</strong>
                                <div>Answer: {ft.answer}</div>
                            </div>
                        ))
                    ) : (
                        <div>No free text questions</div>
                    )}
                </div>
                <button className="attend">modify quiz</button>
            </div>
        ) : (
            <div className="details-container">
                <div className="quiz-title">Title: {data.title}</div>
                <div className="quiz-subject">Subject: {data.subject}</div>
                <div className="quiz-description">Description: {data.description}</div>
                <div className="quiz-duration">Duration: {data.quizDuration} mins</div>
                <div className="created-at">{data.createdAt}</div>
                <div className="creator">
                    <div className="creator-name">Teacher: {data.createdBy?.name}</div>
                    <div className="creator-name">Teacher username: {data.createdBy?.userName}</div>
                </div>
                <button 
                    className="attend" 
                    onClick={handelStartQuiz}
                    disabled={loading}
                >
                    {loading ? "Starting..." : "attend quiz"}
                </button>
            </div>
        )
    );
};

export default QuizDetails;