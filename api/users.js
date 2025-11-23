import express from "express";
import bcrypt from "bcrypt";
import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

const router = express.Router();

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashed);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(400).send("Invalid credentials.");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send("Invalid credentials.");
    const token = createToken({ id: user.id });
    res.status(200).send(token);
  }
);

export default router;
