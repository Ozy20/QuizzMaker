import axios from "axios";
import api from "../API";

const startQuiz = async (userRole,token, QuizID) => {
    try {
        if (!userRole || !token) {
            throw new Error("userRole and token are required");
        }

        let response;

        const config = {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        };
        if (userRole === "student") {
            response = await axios.get(`${api}/student/startQuiz/${QuizID}`, config);

            if (response.status === 201) {
                console.log("Started the quiz");
                return {
                    success: true,
                    message: "Started the quiz successfully"
                };
            } else {
                console.log("Error while starting the quiz");
                return {
                    success: false,
                    error: response.statusText,
                    message: response.data.message
                };
            }
        }
        else {
            throw new Error("Only students can take quizes");
        }
    }
    catch (error) {
        console.log("Starting quiz error:", error);

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
};


const quizAttempt = async(userRole, token,QuizID)=>{
     try {
        if (!userRole || !token||!QuizID) {
            throw new Error("userRole,quiz id and token are required");
        }

        let response;
        
        const config = {
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            }
        };

        if (userRole === "student") {
            response = await axios.get(`${api}/student/getQuizAttempt/${QuizID}`, config);
            
            if (response.status === 200) {
                console.log("Student quiz fetched successfully");
                return {
                    success: true,
                    data: response.data.data,
                    message: "Quizzes fetched successfully"
                };
            } else {
                console.log("Error while fetching student quiz");
                return {
                    success: false,
                    error: response.statusText,
                    message: "Failed to fetch student quiz"
                };
            }
        } 
        else {
            throw new Error("Invalid userRole. Must be 'teacher' or 'student'");
        }
    } 
    catch (error) {
        console.log("Error in getQuizzes:", error);
        
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

export default {startQuiz,quizAttempt};