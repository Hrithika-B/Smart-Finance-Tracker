import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },

  limit: {
    type: Number,
    default: 0
  },  
  
});

export default mongoose.model("Budget", budgetSchema);