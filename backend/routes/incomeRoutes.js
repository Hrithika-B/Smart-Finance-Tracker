import express from "express";
import Income from "../models/Income.js";

const router = express.Router();


// ================= ADD INCOME =================

router.post("/add", async (req, res) => {
  try {
    const { userId, source, amount } = req.body;

    const newIncome = new Income({
      userId,
      source,
      amount
    });

    await newIncome.save();

    res.json({
      success: true,
      income: newIncome
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ================= GET USER INCOME =================

router.get("/list/:userId", async (req, res) => {
  try {
    const incomes = await Income.find({
      userId: req.params.userId
    });

    res.json(incomes);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// ================= DELETE INCOME =================

router.delete("/delete/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);

    res.json({
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;