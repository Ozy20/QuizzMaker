import "./questions.css"
const MCQOption = ({ option, isCorrect }) => {
    return (
        <div className="mcq-option">
            <span className="option-text">{option}</span>
            {isCorrect && <span className="correct-indicator">✓</span>}
        </div>
    );
};

const MCQQuestion = ({ question, options, questionNumber }) => {
    return (
        <div className="mcq-question-display">
            <div className="question-header">
                <span className="question-number">Q{questionNumber}:</span>
                <span className="question-text">{question}</span>
            </div>
            <div className="options-list">
                {options.map((opt, index) => (
                    <MCQOption 
                        key={index} 
                        option={opt.option} 
                        isCorrect={opt.isCorrect} 
                    />
                ))}
            </div>
        </div>
    );
};

const FreeTextQuestion = ({ question, answer, questionNumber }) => {
    return (
        <div className="ft-question-display">
            <div className="question-header">
                <span className="question-number">Q{questionNumber}:</span>
                <span className="question-text">{question}</span>
            </div>
            <div className="answer-display">
                <span className="answer-label">Answer:</span>
                <span className="answer-text">{answer}</span>
            </div>
        </div>
    );
};

export { MCQOption, MCQQuestion, FreeTextQuestion };