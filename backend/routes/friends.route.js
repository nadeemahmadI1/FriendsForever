import express from "express";
import auth from "../middlewares/auth.js";
import { searchFriend, friendReq, acceptReq, getFriendRequests, getAllFriends, removeFriend } from "../controllers/friends.controller.js"; 

const router = express.Router();


router.get("/search", auth , searchFriend);
router.post("/request/:id", auth, friendReq);
router.get("/friend-requests", auth, getFriendRequests);
router.get("/allfriends", auth, getAllFriends);
router.post("/respond/:id", auth, acceptReq);
router.delete("/remove/:friendId", auth,removeFriend);


export default router;
