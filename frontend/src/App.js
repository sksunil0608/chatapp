import "./App.css";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import JoinGroupInviteLink from "./screens/JoinGroupInviteLink";
import Error from "./screens/Error";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
          <Route exact index element={<Home />} />
          <Route exact path="login" element={<Login/>} />
          <Route exact path="signup" element={<Signup/>} />
          <Route exact path="join/group/:groupId" element={<JoinGroupInviteLink/>}/>
          <Route exact path="*" element={<Error/>} />
      </Routes>
    </Router>
  );
}

export default App;
