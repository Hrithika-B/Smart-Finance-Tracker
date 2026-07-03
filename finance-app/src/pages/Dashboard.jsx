import { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  FaWallet,
  FaPiggyBank,
  FaShoppingCart,
  FaBullseye,
  FaMoneyBillWave,
  FaExchangeAlt
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [goals, setGoals] = useState([]);
  const [incomeList, setIncomeList] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // INCOME
    fetch(`http://localhost:5000/api/income/list/${userId}`)
      .then((r) => r.json())
      .then((data) =>
        setIncomeList(Array.isArray(data) ? data : [])
      )
      .catch(() => setIncomeList([]));

    // EXPENSES
    fetch(`http://localhost:5000/api/expense/list?userId=${userId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then((r) => r.json())
      .then((data) => setExpenses(Array.isArray(data) ? data : []))
      .catch(() => setExpenses([]));

    // BUDGET
    fetch(`http://localhost:5000/api/budget/get?userId=${userId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then((r) => r.json())
      .then((data) => setBudget(Number(data?.limit) || 0))
      .catch(() => setBudget(0));

    // GOALS
    fetch(`http://localhost:5000/api/goal/list?userId=${userId}`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then((r) => r.json())
      .then((data) => setGoals(Array.isArray(data) ? data : []))
      .catch(() => setGoals([]));

  }, []);

  const totalIncome = incomeList.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );
  const totalSpent = expenses.reduce(
  (a, b) => a + Number(b.amount || 0),
  0
);

  const totalTransactions = expenses.length;

  const totalGoalSavings = goals.reduce(
    (a, b) => a + Number(b.savedAmount || 0),
    0
  );

  const remainingBudget = budget - totalSpent;

  const availableMoney =
    totalIncome - totalSpent - totalGoalSavings;

  const isOverBudget = totalSpent > budget;

  const budgetUsedPercent =
    budget > 0
      ? Math.min((totalSpent / budget) * 100, 100)
      : 0;
/* ================= SMART INSIGHTS ================= */


let insight =

  "Your finances are being tracked successfully.";


const foodExpense = expenses

  .filter((e) => e.category === "Food")

  .reduce(

    (sum, e) => sum + Number(e.amount || 0),

    0

  );


if (

  totalSpent > 0 &&

  (foodExpense / totalSpent) * 100 > 40

) {

  insight =

    "💡 More than 40% of your expenses are spent on Food. Consider reducing food expenses.";

}

else if (budgetUsedPercent > 60) {

  insight =

    "⚠ You have used more than 60% of your budget.";

}

else if (totalGoalSavings > 0) {

  insight =

    "🎯 Great job! You are actively saving towards your financial goals.";

}
  /* ================= CATEGORY ================= */

  const byCategory = {};

  expenses.forEach((e) => {
    const cat = e.category || "Other";
    byCategory[cat] =
      (byCategory[cat] || 0) + Number(e.amount || 0);
  });

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#6b7280"
  ];

  const donutData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: colors
      }
    ]
  };
/* ================= INCOME SOURCE ================= */

const incomeBySource = {};

incomeList.forEach((item) => {
  const source = item.source || "Other";

  incomeBySource[source] =
    (incomeBySource[source] || 0) +
    Number(item.amount || 0);
});

const incomePieData = {
  labels: Object.keys(incomeBySource),

  datasets: [
    {
      data: Object.values(incomeBySource),

      backgroundColor: [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#6b7280"
      ]
    }
  ]
};
  /* ================= DAILY ================= */

  const days = {};

  expenses.forEach((e) => {
    const d = e.date ? e.date.slice(8, 10) : "NA";
    const cat = e.category || "Other";

    if (!days[d]) days[d] = {};
    days[d][cat] =
      (days[d][cat] || 0) + Number(e.amount || 0);
  });

  const categories = Object.keys(byCategory);

  const barData = {
    labels: Object.keys(days),
    datasets: categories.map((c, i) => ({
      label: c,
      data: Object.keys(days).map((d) => days[d][c] || 0),
      backgroundColor: colors[i % colors.length]
    }))
  };

  /* ================= GOALS ================= */

  const shortGoal = goals.find((g) => g.type === "short");
  const longGoal = goals.find((g) => g.type === "long");

  const shortPercent = shortGoal
    ? Math.min(
        (shortGoal.savedAmount / shortGoal.targetAmount) * 100,
        100
      )
    : 0;

  const longPercent = longGoal
    ? Math.min(
        (longGoal.savedAmount / longGoal.targetAmount) * 100,
        100
      )
    : 0;
    const shortCompleted =
  shortGoal &&
  shortGoal.savedAmount >= shortGoal.targetAmount;

const longCompleted =
  longGoal &&
  longGoal.savedAmount >= longGoal.targetAmount;

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <div
  style={{
    background: "#f0f9ff",
    borderLeft: "5px solid #2563eb",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px"
  }}
>
  <h4>Smart Financial Insight</h4>
  <p>{insight}</p>
</div>

      {/* SUMMARY */}
      <div className="summary-cards">
        <div className="budget-progress">
          <div className="budget-text">
            Budget Used: {budgetUsedPercent.toFixed(0)}%
          </div>

          <div className="progress-bar">
            <div
              className={`progress-fill ${isOverBudget ? "danger" : ""}`}
              style={{
                width: `${budgetUsedPercent}%`
              }}
            />
          </div>
        </div>

        <div className="summary-card income">
          <FaWallet className="icon" />
          <h4>Income</h4>
          <p>₹{totalIncome}</p>
        </div>

        

        <div className="summary-card expense">
          <FaShoppingCart className="icon" />
          <h4>Expenses</h4>
          <p>₹{totalSpent}</p>
        </div>

        <div className="summary-card goal">
          <FaBullseye className="icon" />
          <h4>Goal Savings</h4>
          <p>₹{totalGoalSavings}</p>
        </div>

        <div className="summary-card balance">
          <FaMoneyBillWave className="icon" />
          <h4>Balance</h4>
          <p>₹{availableMoney}</p>
        </div>
        <div className="summary-card budget">
          <FaPiggyBank className="icon" />
          <h4>Budget</h4>
          <p>₹{budget}</p>
          <small style={{ color: isOverBudget ? "red" : "green" }}>
            {isOverBudget
              ? `Over Budget by ₹${Math.abs(remainingBudget)}`
              : `₹${remainingBudget} Left`}
          </small>
        </div>

        <div className="summary-card transaction">
          <FaExchangeAlt className="icon" />
          <h4>Transactions</h4>
          <p>{totalTransactions}</p>
        </div>
      </div>

     {/* CHARTS */}
<div className="graph-section">

  {/* Doughnut Chart */}
  <div className="graph-card chart-box">
    <h4>Spending by Category</h4>

    <div className="chart-wrapper">
      <Doughnut
        data={donutData}
        options={{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
    </div>
  </div>

  {/* Bar Chart */}
  <div className="graph-card chart-box">
    <h4>Daily Spending Trend</h4>

    <div className="chart-wrapper">
      <Bar
        data={barData}
        options={{
          responsive: true,
          maintainAspectRatio: false
        }}
      />
    </div>
  </div>
<div className="graph-card chart-box">
  <h4>Income Sources</h4>

  <div className="chart-wrapper">
    <Doughnut
      data={incomePieData}
      options={{
        responsive: true,
        maintainAspectRatio: false
      }}
    />
  </div>
</div>
</div>
      {/* GOALS */}
      {shortGoal && (
  <div className="goal-card">
    <h4>🟢 Short-Term Goal: {shortGoal.title}</h4>

    <div className="goal-bar">
      <div
  style={{
    width: `${shortPercent}%`,
    background: shortCompleted
      ? "green"
      : "#f59e0b",
    height: "100%"
  }}
/>
    </div>

    <p>
      ₹{shortGoal.savedAmount} / ₹{shortGoal.targetAmount}
      ({shortPercent.toFixed(0)}%)
    </p>

    {shortPercent >= 100 && (
      <p style={{ color: "green", fontWeight: "bold" }}>
        🎉 Goal Completed
      </p>
    )}
  </div>
)}
       {longGoal && (
  <div className="goal-card">
    <h4>🔵 Long-Term Goal: {longGoal.title}</h4>

    <div className="goal-bar">
      <div
  style={{
    width: `${longPercent}%`,
    background: longCompleted
      ? "green"
      : "#2563eb",
    height: "100%"
  }}
/>
    </div>

    <p>
      ₹{longGoal.savedAmount} / ₹{longGoal.targetAmount}
      ({longPercent.toFixed(0)}%)
    </p>

    {longPercent >= 100 && (
      <p style={{ color: "green", fontWeight: "bold" }}>
        🎉 Goal Completed
      </p>
    )}
  </div>
)}

      {/* TABLE */}
      <div className="expense-table">
        <h4>Recent Transactions</h4>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {expenses.slice(0, 5).map((e) => (
              <tr key={e._id}>
                <td>{e.date?.slice(0, 10)}</td>
                <td>{e.title}</td>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;