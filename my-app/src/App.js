import './App.css';
import LoginSignUp from "./pages/loginSignUp/loginSignUp"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StdDash from './pages/stdDashboard/dashboard';
import TeacherDash from './pages/teacherDashboard/dashboard';
import NewQuiz from './pages/newQuiz/newQuiz';
import QuizDetails from './pages/quizDetails/quizDetails';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginSignUp />}></Route>
        <Route path='/teacherDashboard' element={<TeacherDash />}></Route>
        <Route path='/studentDashboard' element={<StdDash />}></Route>
        <Route path="/createQuiz" element={<NewQuiz/>}></Route>
        <Route path='/quiz/:quizId' element={<QuizDetails/>}></Route>
      </Routes>
    </BrowserRouter>


  );
}

export default App;
