import express from "express";
import { authenticateToken } from "../services/AuthService.js";
import PostRepository from "../repositories/PostRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import {
  isUndefinedOrEmpty,
  validateRequiredField,
  withErrorHandling,
} from "./RouteUtils.js";
import DataAccessError from "../repositories/DataAccessError.js";

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/",
  withErrorHandling((req, res) => {
    if (req.query.username !== undefined) {
      const username = req.query.username;
      validateRequiredField(username, "'username' query parameter is required");

      const posts = PostRepository.getPostOfUser(username);
      return res.status(200).send(posts);
    } else {
      const username = req.username;
      const following = UserRepository.getFollowingUsernames(username);
      const posts = PostRepository.getFeedOfUser(username, following);
      return res.status(200).send(posts);
    }
  })
);

router.post(
  "/",
  withErrorHandling((req, res) => {
    const username = req.username;
    const content = req.body.content;
    validateRequiredField(content, "'content' field in body is required");

    const post = PostRepository.createPost(username, content, new Date());
    res.status(201).send(post);
  })
);

router.patch(
  "/:id",
  withErrorHandling((req, res) => {
    const id = req.params.id;
    const action = req.body.action;
    const username = req.username;
    validateRequiredField(id, "'id' route variable is required");
    validateRequiredField(action, "'action' field in body is required");
    if (["like", "unlike"].includes(req.body.action) === false) {
      return res.status(400).send("Bad Request. Invalid action provided");
    }

    if (action === "like") {
      PostRepository.likePost(username, id);
      return res.status(200).send("Post liked");
    } else if (action === "unlike") {
      PostRepository.unlikePost(username, id);
      return res.status(200).send("Post unliked");
    }
  })
);

export default router;
