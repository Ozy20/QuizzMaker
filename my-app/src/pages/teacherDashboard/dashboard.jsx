import Quiz from "../../components/quiz/quiz";
import { useState, useEffect } from "react";
import getQuizzes from "../../services/getQuizzes";
import { useNavigate } from "react-router-dom";
import "./teacherDash.css"
const TeacherDash = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [qn, setQn] = useState(0);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getQuizzes("teacher", token);

                if (response.success === true) {
                    setData(response.data);
                    setQn(data.length)
                } else {
                    setError(response.message || "failed to fetch quizzes");
                }
            } catch (err) {
                setError("error occurred while fetching quizzes");
                console.error("Error fetching quizzes:", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchQuizzes();
        } else {
            setError("No authentication token found");
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div className="loading">Loading quizzes...</div>;
    }

    if (error) {
        return <div className="error"> {error}</div>;
    }

    return (
        <div>
            <div className="Dash-header">
                <div className="your-quizzes" >Your quizzes  {qn > 0 ? qn : ""}</div>
                <button className="newQuiz" onClick={()=>{navigate("/createQuiz")}}>create new quiz</button>
            </div>
            <div className="line"></div>
            <div className="Quizzes-container">
                {data.length > 0 ? (
                    data.map((quiz, idx) => (
                        <Quiz
                            key={quiz.id || idx}
                            title={quiz.title}
                            subject={quiz.subject}
                            description={quiz.description}
                            userRole={"teacher"}
                            quizId={quiz._id}
                            createdAt={quiz.createdAt}
                        />
                    ))
                ) : (
                    <div className="no-quizzes">No quizzes found</div>
                )}
            </div>
        </div>

    );
};

export default TeacherDash;