import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./HomePage";
// import FriendRequests from "./FriendRequests";
// import RecommendedFriends from "./RecommendedFriends";
import Login from "./components/Login/Login.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Home from "./components/home/Home.jsx";
import RecommendedFriends from "./pages/RecommendedFriends.jsx";
import Friend from "./pages/friends/Friend.jsx";
import Request from "./pages/Requests/Request.jsx";

const App = () => {
  return (
   
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/recommended" element={<RecommendedFriends/>} />
         <Route path="/friend" element={<Friend />} />
         <Route path="/requests" element={<Request />} />
      </Routes>
   
  );
};

export default App;
