// SearchContext.js
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friend, setFriend] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  // Handle search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!query.trim()) {
      setError("Please enter a username to search");
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/friends/search?q=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setQuery("");
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "No users found");
        setResults([]);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Error fetching search results");
    }
  };

  // Function to send friend request
  const addFriend = async (userId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/friends/request/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFriend(data);
        setError("");
        navigate("/home");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unable to add friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setError(error.message || "An error occurred while adding a friend");
    }
  };

  // Function to fetch friend requests
  const fetchFriendRequests = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/friends/friend-requests",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFriendRequests(data.friendRequests);
        setError("");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unable to fetch friend requests");
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      setError(error.message || "An error occurred while fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const acceptFriendRequest = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/friends/respond/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accept: true }), // Include the accept parameter in the request body
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response Error:", errorData);
        throw new Error(
          errorData.message || "Failed to accept friend request."
        );
      }

      // Remove the accepted request from the state
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== userId)
      );
    } catch (error) {
      console.error("Request Error:", error);
      setError(
        error.message || "An error occurred while accepting the request."
      );
    }
  };

  const rejectFriendRequest = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/friends/remove/${userId}`,
        {
          method: "DELETE", // Use DELETE method to remove the friend
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Response Error:", errorData);
        throw new Error(
          errorData.message || "Failed to remove friend request."
        );
      }

      // Update the state to remove the rejected request
      setFriendRequests((prev) =>
        prev.filter((request) => request._id !== userId)
      );
    } catch (error) {
      console.error("Request Error:", error);
      setError(
        error.message || "An error occurred while removing the request."
      );
    }
  };

  // Function to fetch all friends
  const allFriends = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/friends/allfriends",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFriends(data.friends);
        setError("");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unable to fetch friends list.");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError(error.message || "An error occurred while fetching friends.");
    } finally {
      setLoading(false);
    }
  };

 //logout just by removing token
  const logout = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        navigate('/login');
        // window.location.href = "/login";
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to logout.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    query,
    setQuery,
    error,
    setError,
    results,
    setResults,
    friend,
    setFriend,
    handleSearch,
    addFriend,
    loading,
    setLoading,
    fetchFriendRequests,
    friendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    friends,
    setFriends,
    allFriends,
    logout
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
