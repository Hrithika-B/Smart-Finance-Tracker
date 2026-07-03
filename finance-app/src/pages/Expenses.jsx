import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
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

function Expenses() {
  const [list, setList] = useState([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  /* ---------- Date formatter ---------- */
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  /* ---------- Load Expenses ---------- */
  const load = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:5000/api/expense/list?userId=${userId}`,
      {
        headers: { Authorization: "Bearer " + token }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((e) => {
          const d = new Date(e.date);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");

          return `${y}-${m}` === currentMonth;
        });

        setList(filtered);
      });
  };

  useEffect(load, []);

  /* ---------- DELETE EXPENSE ---------- */
  const deleteExpense = (id) => {
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:5000/api/expense/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
      .then((res) => res.json())
      .then(() => {
        load();
      });
  };
const updateExpense = async (expense) => {
  const newTitle = prompt(
    "Enter new title:",
    expense.title
  );

  if (newTitle === null) return;

  const newCategory = prompt(
    "Enter new category:",
    expense.category
  );

  if (newCategory === null) return;

  const newAmount = prompt(
    "Enter new amount:",
    expense.amount
  );

  if (newAmount === null) return;

  const token = localStorage.getItem("token");

  await fetch(
    `http://localhost:5000/api/expense/update/${expense._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        title: newTitle,
        category: newCategory,
        amount: newAmount,
        date: expense.date
      })
    }
  );

  load();
};
  /* ---------- Summary ---------- */
  const total = list.reduce((a, b) => a + Number(b.amount), 0);

  const byCategory = {};
  list.forEach((e) => {
    byCategory[e.category] =
      (byCategory[e.category] || 0) + Number(e.amount);
  });

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        data: Object.values(byCategory),
        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#6b7280"
        ]
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 12, font: { size: 12 } }
      }
    }
  };

  const byDay = {};
  list.forEach((e) => {
    const d = new Date(e.date).getDate();
    byDay[d] = (byDay[d] || 0) + Number(e.amount);
  });

  const barData = {
    labels: Object.keys(byDay),
    datasets: [
      {
        label: "Daily Spending",
        data: Object.values(byDay),
        backgroundColor: [
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
  "#06b6d4",
  "#e11d48",
  "#a855f7",
  "#22c55e",
  "#facc15",
  "#0ea5e9",
  "#fb7185",
  "#4ade80",
  "#f43f5e",
  "#7c3aed",
  "#65a30d",
  "#0891b2",
  "#ea580c",
  "#2563eb",
  "#d946ef",
  "#059669",
  "#dc2626",
  "#9333ea",
  "#16a34a",
  "#0284c7",
  "#ca8a04"
]
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div>

      {/* ✅ CLEAN SINGLE HEADER (FIXED DUPLICATE ISSUE) */}
      <div className="expense-header">
 <h2 className="expense-title">💸 Your Expenses</h2>

  <div style={{ textAlign: "right" }}>
    {new Date().toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric"
    })}
  </div>
</div>

      {/* Summary */}
      <div className="summary-cards full-row">
        <div className="summary-card">
          <h4>Total Spent</h4>
          <p>₹{total}</p>
        </div>

        <div className="summary-card">
          <h4>Top Category</h4>
          <p>{Object.keys(byCategory)[0] || "-"}</p>
        </div>

        <div className="summary-card">
          <h4>Total Transactions</h4>
          <p>{list.length}</p>
        </div>
      </div>

      {/* Graphs */}
      <div className="graph-section full-row">
        <div className="graph-card">
          <h4>Spending by Category</h4>
          <div className="chart-box">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="graph-card">
          <h4>Daily Spending Trend</h4>
          <div className="chart-box">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="expense-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {list.map((e) => (
              <tr key={e._id}>
                <td>{formatDate(e.date)}</td>
                <td>{e.title}</td>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>

                <td>
  <button
    onClick={() => updateExpense(e)}
    style={{
      background: "#2563eb",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "5px"
    }}
  >
    Edit
  </button>

  <button
    onClick={() => deleteExpense(e._id)}
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "5px 10px",
      borderRadius: "5px",
      cursor: "pointer"
    }}
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Expenses;  