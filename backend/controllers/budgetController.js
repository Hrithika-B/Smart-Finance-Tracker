import Budget from "../models/Budget.js";

/* =========================
   SET BUDGET
========================= */
export const setBudget = async (req, res) => {
  try {
    const { userId, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId },
      {
        $set: { limit }
      },
      { upsert: true, new: true }
    );

    res.json(budget);

  } catch (err) {
    res.status(400).json({ error: "Budget not saved" });
  }
};

/* =========================
   GET BUDGET
========================= */
export const getBudget = async (req, res) => {
  try {
    const { userId } = req.query;

    const budget = await Budget.findOne({ userId });

    if (!budget) {
      return res.json({
        limit: 0
      });
    }

    return res.json({
      limit: budget.limit || 0
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch budget"
    });
  }
};