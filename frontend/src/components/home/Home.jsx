import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../../Shared/Navbar";
import { AppContext } from "../../Context/AppContext";

const Home = () => {
  const { error, results, addFriend, loading } = useContext(AppContext);

  return (
    <>
      <Navbar />
      <div className="home-container">
        {error && <p className="error-message">{error}</p>}
        {results.length > 0 ? (
          results.map((user) => (
            <div className="result-card" key={user._id}>
              <div className="user-info">
                <img
                  src={user.profilePicture || "/default-profile.png"}
                  alt={user.username}
                  className="profile-pic"
                />
                <div className="user-details">
                  <h2>{user.username}</h2>
                  <p>{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => addFriend(user._id)}
                className={`action-button ${
                  loading === user._id ? "loading" : ""
                }`}
              >
                {loading === user._id ? "Request Sent" : "Add Friend"}
              </button>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </>
  );
};

export default Home;
