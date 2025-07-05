import React from "react";
import "./quiz.css"


//title subject description createdAt
function Quiz({title, subject, description, createdAt}) {
    return (
        <div className="container" onClick="">
            <div className="element">{title}</div>
            <div className="element">{subject}</div>
            <div className="element">{description}</div>
            <div className="element">{createdAt}</div>
        </div>
    );
}

export default Quiz;