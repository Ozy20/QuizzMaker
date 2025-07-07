import "./newQuiz.css"
import { useState } from "react";
import { MCQOption, MCQQuestion, FreeTextQuestion } from "../../components/questions/questions"
import createQuiz from "../../services/createQuiz";
import { useNavigate } from "react-router-dom";

// final arr before any req with usestates
const NewQuiz = () => {
    const navigate = useNavigate();
    const [Quiz, setQuiz] = useState({
        title: '',
        subject: '',
        description: '',
        mcqQuestions: [],
        freeTextQuestions: [],
        quizDuration: 0,
    })
    const [numberOfQuestions, setNumberOfQuestions] = useState(0)
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)
    const [error, setError] = useState("")
    //mcq qestions
    
    const [mcqQuestion, setMcqQuestion] = useState("")
    const [fullOption, setFullOption] = useState({
        option: "",
        isCorrect: false
    })
    const [option, setOption] = useState("")
    const [isTrue, setIsTrue] = useState(false);
    const [optionError, setOptionError] = useState("")
    const [options, setOptions] = useState([])

    //ft questions

    const [ftQuestion, setFtQuestion] = useState("");
    const [ftAnswer, setFtAnswer] = useState("");
    //all
    const [mcqs, setMcqs] = useState([]);
    const [fts, setFts] = useState([]);

    const mcqHandleQestion = (e) => {
        const { value } = e.target;
        setMcqQuestion(value)
        console.log("your mcq " + value)
    }
    const mcqHandleOption = (e) => {
        const { value } = e.target;
        setOption(value)
        console.log("the option you added is " + value)

    }
    const addOption = () => {
        setOptionError("");
        if (!option) {
            setOptionError("option is required");
            return;
        }
        const newOption = {
            option: option,
            isCorrect: isTrue
        };
        setOptions([...options, newOption]);
        setOption("");
        console.log(options)

    }
    const addMcq = () => {
        const newMcq = {
            question: mcqQuestion,
            options: options,
            marks: 0
        };
        const updatedMcqs = [...mcqs, newMcq];
        setMcqs(updatedMcqs);
        setNumberOfQuestions(numberOfQuestions + 1);
        setMcqQuestion("");
        setOptions([]);

        setQuiz({ ...Quiz, mcqQuestions: updatedMcqs });
        console.log(updatedMcqs);
    };

    const freeTextHandleQestion = (e) => {
        const { value } = e.target;
        setFtQuestion(value)
        console.log("your ft " + value)
    }

    const freeTextHandleAnswer = (e) => {
        const { value } = e.target;
        setFtAnswer(value)
        console.log("your ft " + value)
    }
    const addFT = () => {
        const newFT = {
            question: ftQuestion,
            answer: ftAnswer,
            marks: 0
        };
        const updatedFts = [...fts, newFT];
        setFts(updatedFts);
        setNumberOfQuestions(numberOfQuestions + 1);
        setFtQuestion("");
        setFtAnswer("");

        setQuiz({ ...Quiz, freeTextQuestions: updatedFts });
        console.log(updatedFts);
    };

    const handelCreating = async () => {
        try {
            setLoading(true);
            setError("");

            const finalQuiz = {
                ...Quiz,
                mcqQuestions: mcqs,
                freeTextQuestions: fts
            };

            if (!finalQuiz.title || !finalQuiz.subject || !finalQuiz.quizDuration) {
                setError("missing required field");
                return;
            }
            else if (numberOfQuestions <= 0) {
                setError("can not create an empty quiz");
                return;
            }
            else {
                const token = localStorage.getItem("token");
                const response = await createQuiz(token, finalQuiz);
                if (response.success === true) {
                    setCreated(true);
                }
                else {
                    setError(response.message);
                }
            }
        }
        catch (error) {
            console.log(error);
            setError("Error while creating the quiz");
        }
        finally {
            setLoading(false);
            console.log("Final Quiz:", { ...Quiz, mcqQuestions: mcqs, freeTextQuestions: fts });
        }
    };

    return (
        <div className="quiz-container">
            <input type="text" className="add-title" placeholder="Add the quiz title" name="title"
                onChange={(e) => setQuiz({ ...Quiz, title: e.target.value })} />
            <input type="text" className="add-subject" placeholder="Add the quiz subject" name="subject"
                onChange={(e) => setQuiz({ ...Quiz, subject: e.target.value })} />
            <input type="text" className="add-duration" placeholder="Add the quiz duration" name="quizDuration"
                onChange={(e) => setQuiz({ ...Quiz, quizDuration: parseInt(e.target.value) })} />
            <input type="text" className="add-description" placeholder="Add the quiz description" name="description"
                onChange={(e) => setQuiz({ ...Quiz, description: e.target.value })} />
            <div className="mcq-adder">
                <div className="mcq-adder-header">MCQ</div>
                <input type="text" className="mcq" placeholder="Add the MCQ questions" name="mcqQuestion" onChange={mcqHandleQestion} value={mcqQuestion} />
                <div className="add-options">
                    <input type="text" className="option-content" placeholder="Add the option" onChange={mcqHandleOption} value={option} />
                    <div className="is-true" style={{ backgroundColor: isTrue === true ? "#321158" : "#fff", color: isTrue === true ? "#fff" : "#321158" }} onClick={() => setIsTrue(true)}>Right answer</div>
                    <div className="is-true" style={{ backgroundColor: isTrue === false ? "#321158" : "#fff", color: isTrue === false ? "#fff" : "#321158" }} onClick={() => setIsTrue(false)}>False answer</div>
                    <button className="send-option" onClick={() => addOption()}>Add</button>
                </div>
                <div className="quistions-list">
                    {options.length > 0 ? (
                        options.map((option, idx) => (
                            <MCQOption
                                key={idx}
                                option={option.option}
                                isCorrect={option.isCorrect}
                            />
                        ))
                    ) : (
                        <div>No options added yet</div>
                    )}
                </div>
                <div className="send-quiz" onClick={() => { addMcq(); setQuiz({ ...Quiz, mcqQuestions: mcqs }) }}>Add question</div>

            </div>
            <div className="free-text-adder">
                <div className="FT-adder-header">Free Text</div>
                <input type="text" className="free-text" placeholder="Add the free text question" onChange={freeTextHandleQestion} value={ftQuestion} />
                <input type="text" className="add-answer" placeholder="Add the answer" onChange={freeTextHandleAnswer} value={ftAnswer} />
                <div className="send-quiz" onClick={() => { addFT(); setQuiz({ ...Quiz, freeTextQuestions: fts }) }}>Add question</div>
            </div>
            <div className="quistions-list">
                {mcqs.length > 0 ? (
                    mcqs.map((mcq, idx) => (
                        <MCQQuestion
                            key={idx}
                            question={mcq.question}
                            options={mcq.options}

                        />
                    ))
                ) : (
                    <div>No MCQ added yet</div>
                )}
                {fts.length > 0 ? (
                    fts.map((ft, idx) => (
                        <FreeTextQuestion
                            key={idx}
                            question={ft.question}
                            answer={ft.answer}

                        />
                    ))
                ) : (
                    <div>No free text questions added yet</div>
                )}
            </div>
            {loading === false ? (<div className="send-quiz" onClick={() => {handelCreating();navigate("/teacherDashboard",{ state: { refresh: true }})}}>Create</div>) : (<div className="send-quiz">creating...</div>)}
            {error !== "" ? (<div>{error}</div>) : (<div></div>)}
        </div>
    );

}
export default NewQuiz;