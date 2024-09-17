import { User } from "../models/user.model.js";
// Search users by username
// Search users by username
export const searchFriend = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Query parameter 'q' is required" });
  }

  try {
    const users = await User.find({ username: new RegExp(q, "i") });
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users" });
  }
};

// Send friend request
export const friendReq = async (req, res) => {
  try {
    // Get recipientId from the URL parameters instead of req.body
    const recipient = await User.findById(req.params.id);

    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }
    if (recipient.friendRequests.includes(req.id)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }
    // Add the sender's ID (req.user.id) to the recipient's friend requests
    recipient.friendRequests.push(req.id);
    await recipient.save();

    return res.status(200).json({
      message: "Friend request sent",
      success: true,
    });
  } catch (error) {
    console.error("Error sending friend request:", error.message); 
    res.status(500).json({ message: "Error sending friend request" });
  }
};
// Accept friend request
export const acceptReq = async (req, res) => {
  try {
    const { accept } = req.body;
    const requestId = req.params.id; // Get the requestId from the URL parameters

    const requester = await User.findById(requestId);
    if (!requester) {
      return res.status(404).json({ message: "Requester not found" });
    }

    // Check if the authenticated user exists
    const user = await User.findById(req.id); 
    if (!user) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }

    if (accept) {
      if (user.friends.includes(requestId)) {
        return res.status(400).json({ message: "Already friends" });
      }
      // Add to friends list for both users
      user.friends.push(requestId);
      requester.friends.push(req.id);
    }

    // Remove the friend request from the user's pending requests
    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== requestId.toString()
    );

    await user.save();
    await requester.save();

    return res.json({ message: accept ? "Friend added" : "Request rejected" });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ message: "Error responding to friend request" });
  }
};


// Get all friend requests for the authenticated user
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate(
      "friendRequests",
      "username email"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Friend requests fetched successfully",
      friendRequests: user.friendRequests,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching friend requests:", error.message);
    res.status(500).json({ message: "Error fetching friend requests" });
  }
};

// Get all friends
export const getAllFriends = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate(
      "friends",
      "username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Friends fetched successfully",
      friends: user.friends,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends" });
  }
};

// Remove a friend from the authenticated user's friend list
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    // Remove friend from user's friends list
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    // Remove user from friend's friends list
    friend.friends = friend.friends.filter((id) => id.toString() !== req.id);

    await user.save();
    await friend.save();

    return res.status(200).json({
      message: "Friend removed successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Error removing friend" });
  }
};


export const getFriendRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("friends");

    const mutualFriends = await User.find({
      _id: { $ne: req.id }, // Exclude the current user
      friends: { $in: user.friends }, // Find users who are friends with your friends
    }).select("username email");

    res.json(mutualFriends);
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend recommendations" });
  }
};
