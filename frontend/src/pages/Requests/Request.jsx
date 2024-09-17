import React, { useContext, useEffect } from "react";
import "./Request.css";
import Navbar from "../../Shared/Navbar";
import { AppContext } from "../../Context/AppContext";

const Request = () => {
  const {
    friendRequests,
    fetchFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useContext(AppContext);

  useEffect(() => {
    fetchFriendRequests(); // Fetch friend requests when the component mounts
  }, []);

  return (
    <div className="request">
      <Navbar />
      <h1>Requests</h1>
      <div className="rqt_container">
        {friendRequests.length > 0 ? (
          friendRequests.map((user) => (
            <div key={user._id} className="card">
              <img src="../../../download.jpeg" alt="Profile" />
              <div className="friend-card">
                <h2>{user.username}</h2>
                <p>{user.email}</p>
              </div>
              <button
                className="accept"
                onClick={() => acceptFriendRequest(user._id)}
              >
                Accept
              </button>
              <button
                className="reject"
                onClick={() => rejectFriendRequest(user._id)}
              >
                Reject
              </button>
            </div>
          ))
        ) : (
          <p>No friend requests available.</p>
        )}
      </div>
    </div>
  );
};

export default Request;
