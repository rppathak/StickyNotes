import './App.css';
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from './component/Home';
import About from './component/About';
import NoteState from './context/notes/NoteState';
import Alert from './component/Alert';
import Login from './component/Login';
import Signup from './component/Signup';
import { useState } from 'react';
import Layout from './component/Layout';
import Notes from './component/Notes';

document.body.style.backgroundColor = "beige"
function App() {
  const [alert, setAlert] = useState("", "", { marginTop: '' })
  const showAlert = (message, type, style) => {
    setAlert({
      msg: message,
      type: type,
      style: style
    })
    setTimeout(() => {
      setAlert("", "", { marginTop: '' });
    }, 1500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Alert alert={alert} />
          <Routes>
            <Route path="login" element={<Login showAlert={showAlert} />} />
            <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />
            <Route path="/" element={<Layout />}>
              <Route path="" element={<Home showAlert={showAlert} />} />
              <Route exact path="about" element={<About />} />
              <Route exact path="myNotes" element={<Notes showAlert={showAlert} />} />
            </Route>
          </Routes>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
