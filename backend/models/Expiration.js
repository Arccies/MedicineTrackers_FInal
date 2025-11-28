import mongoose from "mongoose";

const ExpirationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  itemName: { type: String, required: true },
  expiresAt: { type: String, required: true },
});

export default mongoose.model("Expiration", ExpirationSchema);
