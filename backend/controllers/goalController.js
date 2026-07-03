import Goal from "../models/Goal.js";
import Income from "../models/Income.js";
import Expense from "../models/Expense.js";

/* =======================
   ADD GOAL
======================= */
export const addGoal = async (req, res) => {
  try {
    const { userId, title, targetAmount, type } = req.body;

    const g = await Goal.create({
      userId,
      title,
      targetAmount: Number(targetAmount),
      type,
      savedAmount: 0
    });

    res.json(g);

  } catch (error) {
    res.status(500).json({
      error: "Failed to add goal"
    });
  }
};

/* =======================
   GET GOALS
======================= */
export const getGoals = async (req, res) => {
  try {

    const { userId } = req.query;

    const list = await Goal.find({
      userId
    }).sort({ _id: -1 });

    res.json(list);

  } catch (error) {
    res.status(500).json({
      error: "Cannot load goals"
    });
  }
};

/* =======================
   ADD MONEY TO GOAL
======================= */
export const addToGoal = async (req, res) => {
  try {

    const { goalId, amount } = req.body;
    const addAmount = Number(amount || 0);

    const g = await Goal.findById(goalId);

    if (!g) {
      return res.status(404).json({
        error: "Goal not found"
      });
    }

    if (addAmount <= 0) {
      return res.status(400).json({
        error: "Invalid amount"
      });
    }

    const savedAmount = Number(g.savedAmount);
    const targetAmount = Number(g.targetAmount);

    if (savedAmount >= targetAmount) {
      return res.status(400).json({
        error: "Goal already completed"
      });
    }

    if (savedAmount + addAmount > targetAmount) {
      return res.status(400).json({
        error: "Cannot exceed target amount"
      });
    }

    const incomes = await Income.find({
      userId: g.userId
    });

    const expenses = await Expense.find({
      userId: g.userId
    });

    const goals = await Goal.find({
      userId: g.userId
    });

    const totalIncome = incomes.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalExpense = expenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalGoalSavings = goals.reduce(
      (sum, item) => sum + Number(item.savedAmount || 0),
      0
    );

    const availableBalance =
      totalIncome -
      totalExpense -
      totalGoalSavings;

    if (addAmount > availableBalance) {
      return res.status(400).json({
        error: `Insufficient Balance. Available Balance: ₹${availableBalance}`
      });
    }

    g.savedAmount = savedAmount + addAmount;

    await g.save();

    res.json({
      message: "Goal updated successfully",
      goal: g,
      availableBalance:
        availableBalance - addAmount
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to update goal"
    });
  }
};

/* =======================
   DELETE GOAL
======================= */
export const deleteGoal = async (req, res) => {
  try {

    const deleted =
      await Goal.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Goal not found"
      });
    }

    res.json({
      message: "Goal deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: "Delete failed"
    });
  }
};