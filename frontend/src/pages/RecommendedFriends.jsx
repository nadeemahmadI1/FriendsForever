import React, { useState, useEffect } from "react";

// Component for friend recommendations
const RecommendedFriends = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch friend recommendations from backend
    const fetchRecommendations = async () => {
      const res = await fetch(
        "http://localhost:5000/api/v1/friends/friend-requests"
      );
      const data = await res.json();
      setRecommendations(data);
    };
    fetchRecommendations();
  }, []);

  // Handle sending friend request from recommendation
  const handleSendRequest = async (userId) => {
    try {
      const res = await fetch(`/api/friends/request/${userId}`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Friend request sent!");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div>
      <h3>Friend Recommendations</h3>
      <ul>
        {recommendations.map((friend) => (
          <li key={friend._id}>
            {friend.username}
            <button onClick={() => handleSendRequest(friend._id)}>
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendedFriends;
