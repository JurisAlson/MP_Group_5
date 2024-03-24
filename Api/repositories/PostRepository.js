import { nanoid } from "nanoid";
import DataAccessError from "./DataAccessError.js";
import FileDao from "./FileDao.js";

const FILE_NAME = "POSTS";
const postsPerUser = deserialize() ?? {};

function serialize() {
  FileDao.saveData(FILE_NAME, postsPerUser);
}

function deserialize() {
  return FileDao.retrieveData(FILE_NAME);
}

function createPost(username, post, dateTimePosted) {
  if (postsPerUser[username] === undefined) {
    throw new DataAccessError("User does not exist");
  }

  const createdPost = {
    postId: nanoid(),
    postedBy: username,
    content: post,
    dateTimePosted,
    likes: [],
  };

  postsPerUser[username].push(createdPost);
  serialize();
  return createdPost;
}

function getPostOfUser(username) {
  if (postsPerUser[username] === undefined) {
    throw new DataAccessError("User does not exist");
  }
  return postsPerUser[username];
}

function getFeedOfUser(username, followingUsernames) {
  const feed = [...getPostOfUser(username)];
  for (const username of followingUsernames) {
    if (postsPerUser[username] !== undefined) {
      feed.push(...postsPerUser[username]);
    }
  }
  return feed;
}

function getPost(postId) {
  for (const [_, posts] of Object.entries(postsPerUser)) {
    for (const post of posts) {
      const currentPostId = post.postId;
      if (currentPostId === postId) {
        return post;
      }
    }
  }
  return undefined;
}

function likePost(username, postId) {
  const post = getPost(postId);
  if (post === undefined) {
    throw new DataAccessError("Post does not exist");
  }
  if (post.likes.includes(username)) {
    return post;
  }
  post.likes.push(username);
  console.log(post);
  serialize();
  return post;
}

function unlikePost(username, postId) {
  const post = getPost(postId);
  if (post === undefined) {
    throw new DataAccessError("Post does not exist");
  }
  if (!post.likes.includes(username)) {
    return post;
  }
  post.likes = post.likes.filter((like) => like !== username);
  serialize();
  return post;
}

function initializePosts(username) {
  postsPerUser[username] = [];
  serialize();
}

export default {
  createPost,
  getPostOfUser,
  getFeedOfUser,
  likePost,
  unlikePost,
  initializePosts,
};
