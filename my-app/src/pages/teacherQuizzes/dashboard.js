import React from "react";
import Quiz from "../../components/quiz/quiz";
import './dashboard.css'
const Dashboard = () => {
    const data = [
        {
            title: "Quiz 1",
            subject: "Math",
            description: "Algebra basics",
            createdAt: "2025-07-05"
        },
        {
            title: "Quiz 2",
            subject: "Science",
            description: "Physics fundamentals",
            createdAt: "2025-07-04"
        },
        {
            title: "Quiz 3",
            subject: "History",
            description: "World War II",
            createdAt: "2025-07-03"
        }, {
            title: "Quiz 1",
            subject: "Math",
            description: "Algebra basics",
            createdAt: "2025-07-05"
        },
        {
            title: "Quiz 2",
            subject: "Science",
            description: "Physics fundamentals",
            createdAt: "2025-07-04"
        },
        {
            title: "Quiz 3",
            subject: "History",
            description: "World War II",
            createdAt: "2025-07-03"
        },
        {
            title: "Quiz 1",
            subject: "Math",
            description: "Algebra basics",
            createdAt: "2025-07-05"
        },
        {
            title: "Quiz 2",
            subject: "Science",
            description: "Physics fundamentals",
            createdAt: "2025-07-04"
        },
        {
            title: "Quiz 3",
            subject: "History",
            description: "World War II",
            createdAt: "2025-07-03"
        }
    ];
    return (
        <div className="container">
            <div className="header">
                <div className="newQuiz">
                    create a quiz
                </div>
            </div>
            <div className="QuizzsList">
                {data.map((quiz, idx) => (
                    <Quiz
                        key={idx}
                        title={quiz.title}
                        subject={quiz.subject}
                        description={quiz.description}
                        createdAt={quiz.createdAt}
                    />
                ))}
            </div>
        </div>

    );

}

export default Dashboard