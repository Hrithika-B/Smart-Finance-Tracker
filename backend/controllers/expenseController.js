import Expense from "../models/Expense.js";

/* =======================
   ADD EXPENSE (FIXED)
======================= */
export const addExpense = async (req, res) => {
  try {
    let { userId, title, amount, category, date } = req.body;

    // ✅ CLEAN AMOUNT (REMOVE ₹, commas, spaces, text)
    amount = parseFloat(
      String(amount)
        .replace(/₹/g, "")
        .replace(/,/g, "")
        .trim()
    ) || 0;

    const exp = await Expense.create({
      userId,
      title,
      amount,
      category,
      date
    });

    res.json(exp);
  } catch (error) {
    res.status(400).json({ error: "Expense not added" });
  }
};

/* =======================
   GET EXPENSES
======================= */
export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.query;

    const list = await Expense.find({ userId }).sort({ date: -1 });

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Cannot load expenses" });
  }
};

/* =======================
   DELETE EXPENSE
======================= */
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
};

/* =======================
   UPDATE EXPENSE (FIXED)
======================= */
export const updateExpense = async (req, res) => {
  try {
    let { title, amount, category } = req.body;

    // ✅ CLEAN AMOUNT HERE ALSO
    if (amount !== undefined) {
      amount = parseFloat(
        String(amount)
          .replace(/₹/g, "")
          .replace(/,/g, "")
          .trim()
      ) || 0;
    }

    const exp = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category },
      { new: true }
    );

    res.json(exp);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
};