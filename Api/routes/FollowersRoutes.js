import express from "express";
import { authenticateToken } from "../services/AuthService.js";
import UserRepository from "../repositories/UserRepository.js";
import {
  isUndefinedOrEmpty,
  validateRequiredField,
  withErrorHandling,
} from "./RouteUtils.js";

const router = express.Router();
router.use(authenticateToken);
router.get(
  "/:follower/following",
  withErrorHandling((req, res) => {
    const followerUsername = req.params.follower;
    validateRequiredField(
      followerUsername,
      "'follower' path value is required"
    );

    const following = UserRepository.getFollowingUsernames(followerUsername);
    return res.status(200).send(following);
  })
);
router.post(
  "/:follower/following/:following",
  withErrorHandling((req, res) => {
    const followerUsername = req.params.follower;
    const usernameToFollow = req.params.following;
    const loggedInUsername = req.username;

    validateRequiredField(
      followerUsername,
      "'follower' path value is required"
    );
    validateRequiredField(
      followerUsername,
      "'following' path value is required"
    );
    if (followerUsername === usernameToFollow) {
      return res.status(400).send("Cannot follow yourself");
    }
    if (followerUsername !== loggedInUsername) {
      return res.status(401).send("Unauthorized");
    }

    UserRepository.followUser(followerUsername, usernameToFollow);

    return res.status(201).send("User followed");
  })
);

router.delete(
  "/:follower/following/:following",
  withErrorHandling((req, res) => {
    const followerUsername = req.params.follower;
    const usernameToUnfollow = req.params.following;
    const loggedInUsername = req.username;
    validateRequiredField(
      followerUsername,
      "'follower' path value is required"
    );
    validateRequiredField(
      followerUsername,
      "'following' path value is required"
    );
    if (followerUsername !== loggedInUsername) {
      return res.status(401).send("Unauthorized");
    }
    if (followerUsername === usernameToUnfollow) {
      return res.status(400).send("Bad Request. Cannot unfollow yourself");
    }

    UserRepository.unfollowUser(followerUsername, usernameToUnfollow);

    res.status(201).send("User unfollowed");
  })
);

export default router;
