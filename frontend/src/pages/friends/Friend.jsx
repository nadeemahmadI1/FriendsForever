import React, { useContext, useEffect } from "react";
import Navbar from "../../Shared/Navbar";
import "./Friend.css";
import { AppContext } from "../../Context/AppContext"; // Importing AppContext

const Friend = () => {
  const { friends, allFriends, loading, error } = useContext(AppContext);

  useEffect(() => {
    allFriends();
  }, []);

  // Ensure unique keys
  const uniqueFriends = Array.from(
    new Map(friends.map((friend) => [friend._id, friend])).values()
  );

  return (
    <>
      <Navbar />
      <div className="friends-container">
        <h2>Friends</h2>
        {loading ? (
          <p className="loading-message">Loading friends...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : uniqueFriends.length > 0 ? (
          uniqueFriends.map((friend) => (
            <div key={friend._id} className="friend-card">
              <img
                src={friend.profilePicture || "/download.jpeg"}
                alt={friend.username}
                className="profile-pic"
              />
              <div className="friend-info">
                <h3>{friend.username}</h3>
                <p>{friend.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-friends-message">No friends found</p>
        )}
      </div>
    </>
  );
};

export default Friend;
