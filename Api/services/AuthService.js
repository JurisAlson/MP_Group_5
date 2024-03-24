import jwt from "jsonwebtoken";
import FileDao from "../repositories/FileDao.js";

const FILE_NAME = "AUTH";
const users = deserialize() ?? [];

function serialize() {
  FileDao.saveData(FILE_NAME, users);
}

function deserialize() {
  return FileDao.retrieveData(FILE_NAME);
}

function registerUser(username, password) {
  const user = {
    username,
    password,
  };
  users.push(user);
  serialize();
  return user;
}

function authorizeUser(username, password) {
  console.log(users);
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  console.log(user);

  if (user !== undefined) {
    return {
      success: true,
      token: generateAccessToken(username),
    };
  } else {
    return {
      success: false,
      token: null,
    };
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { username } = decoded;
    req.username = username;
    console.log(username);
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
}

function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.JWT_KEY, { expiresIn: "24h" });
}

export default {
  registerUser,
  authorizeUser,
  generateAccessToken,
};

export { authenticateToken };
