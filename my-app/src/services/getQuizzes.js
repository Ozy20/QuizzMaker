import axios from "axios";
import api from "../API";

const getQuizzes = async (userRole, token) => {
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
            response = await axios.get(`${api}/teacher/myQuizzes`, config);
            
            if (response.status === 200) {
                console.log("Teacher quizzes fetched successfully");
                return {
                    success: true,
                    data: response.data,
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
            response = await axios.get(`${api}/student/AllQuizzes`, config);
            
            if (response.status === 200) {
                console.log("Student quizzes fetched successfully");
                return {
                    success: true,
                    data: response.data,
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

export default getQuizzes;