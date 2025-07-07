import axios from "axios";
import api from "../API";

const getQuizDetails = async (userRole, token,QuizID) => {
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

        if (userRole === "teacher") {
            response = await axios.get(`${api}/teacher/myQuizzes/${QuizID}`, config);
            
            if (response.status === 200) {
                console.log(response.data);
                return {
                    success: true,
                    data: response.data.data,
                    message: "Quizzes fetched successfully"
                };
            } 
            else if(response.status === 404){
                return {
                    success: false,
                    error: response.statusText,
                    message: "No quizzes to fetch teacher quizzes"
                };
            }
            else {
                console.log("Error while fetching teacher quizzes");
                return {
                    success: false,
                    error: response.statusText,
                    message: "Failed to fetch teacher quizzes"
                };
            }
        } 
        else if (userRole === "student") {
            response = await axios.get(`${api}/student/quiz/${QuizID}`, config);
            
            if (response.status === 200) {
                console.log("Student quizzes fetched successfully");
                return {
                    success: true,
                    data: response.data.data,
                    message: "Quizzes fetched successfully"
                };
            } else {
                console.log("Error while fetching student quizzes");
                return {
                    success: false,
                    error: response.statusText,
                    message: "Failed to fetch student quizzes"
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
};

export default getQuizDetails;