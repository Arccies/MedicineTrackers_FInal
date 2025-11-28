import express from "express";
import Expiration from "../models/Expiration.js";

const router = express.Router();

// GET items for a user
router.get("/:userId", async (req, res) => {
  try {
    const items = await Expiration.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

// ADD item
router.post("/", async (req, res) => {
  try {
    const newItem = await Expiration.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    await Expiration.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete item" });
  }
});

export default router;
