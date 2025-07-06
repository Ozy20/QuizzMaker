import axios from "axios";
import api from "../API";

const deleteQuiz = async (token, quizId) => {
    try {
        if (!token) {
            throw new Error("userRole and token are required");
        }
        let response;
        const config = {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        };
        response = await axios.delete(`${api}/teacher/deleteQuiz/${quizId}`,config)
        if (response.status === 200) {
            return {
                success: true,
                message: "the quiz deleted successfully"
            }
        }
        else if (response.status === 500) {
            return {
                success: false,
                error: response.statusText,
                message: "could not delete the quiz"
            }
        }
    }
    catch (error) {
        console.log(error)
        if (error.response) {
            return {
                success: false,
                error: error.response.data.message || error.response.data.error || 'Server error',
                status: error.response.status,
                message: "Server error occurred"
            };
        } else if (error.request) {
            return {
                success: false,
                error: 'Network error',
                message: "Network error. Please check your connection."
            };
        } else {
            return {
                success: false,
                error: error.message || 'Unknown error',
                message: "An unexpected error occurred"
            };
        }
    }
}
export default deleteQuiz;