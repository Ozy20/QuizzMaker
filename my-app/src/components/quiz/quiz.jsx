import "./quiz.css"
import deleteQuiz from "../../services/deleteQuiz";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Quiz({ title, subject, description, createdAt, userRole, quizId }) {
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const handelDeletion = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token")
            const response = await deleteQuiz(token, quizId)
            if (response.success === true) {
                setDeleted(true)
            }
            else {
                setError(response.message)
            }
        }
        catch (error) {
            console.log(error)
            setError("Error while deleting the quiz")
        }
        finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (<div className="info-container"> deleting quiz
        </div>);
    }
    if (deleted) {
        return;
    }
    return (
        <div className="info-container" onClick={() => { navigate(`/quiz/${quizId}`) }}>
            <div className="info">Title: {title}</div>
            <div className="info">subject: {subject}</div>
            <div className="info">Description: {description}</div>
            <div className="info">Published at: {createdAt}</div>
            {userRole === "teacher" ? <button className="delete-button" onClick={(e) => {
                e.stopPropagation(); 
                handelDeletion();
            }}>Delete</button> : <div></div>}

        </div>
    );
}
export default Quiz;