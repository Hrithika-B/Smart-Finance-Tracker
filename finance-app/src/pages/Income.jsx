import "./Income.css";
import { useState, useEffect } from "react";

function Income() {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [incomeList, setIncomeList] = useState([]);

  const userId = localStorage.getItem("userId");

  // LOAD INCOME FROM DATABASE
  const fetchIncome = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/income/list/${userId}`
      );

      const data = await res.json();

      setIncomeList(Array.isArray(data) ? data : []);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // ADD INCOME
  const addIncome = async () => {
    if (!source || !amount) return;

    try {
      await fetch("http://localhost:5000/api/income/add", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          userId,
          source,
          amount
        })
      });

      setSource("");
      setAmount("");

      fetchIncome();

    } catch (err) {
      console.log(err);
    }
  };

  // DELETE INCOME
  const deleteIncome = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/income/delete/${id}`,
        {
          method: "DELETE"
        }
      );

      fetchIncome();

    } catch (err) {
      console.log(err);
    }
  };

  // TOTAL
  const totalIncome = incomeList.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  return (
    <div className="income-page">

      {/* HEADER */}
      <div className="income-header">
        <h2 className="income-title">
          💰 Income Management
        </h2>

        <p>
          Track all your income sources in one place
        </p>
      </div>

      {/* TOTAL CARD */}
      <div className="income-total-card">
        <h3>Total Income</h3>

        <h1>
          ₹{totalIncome.toLocaleString()}
        </h1>
      </div>

      {/* FORM */}
      <div className="income-form">

        <input
          type="text"
          placeholder="Income Source (Salary, Gift...)"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={addIncome}>
          + Add Income
        </button>

      </div>

      {/* LIST */}
      <div className="income-list">

        {incomeList.length === 0 ? (
          <p className="empty-text">
            No income added yet 🚀
          </p>
        ) : (
          incomeList.map((item) => (
            <div
              className="income-card"
              key={item._id}
            >

              <div className="income-left">
                <h4>{item.source}</h4>
                <span className="tag">
                  Income Source
                </span>
              </div>

              <div className="income-right">

                <p>
                  ₹{Number(item.amount).toLocaleString()}
                </p>

                <button
                  className="delete-btn"
                  onClick={() => deleteIncome(item._id)}
                >
                  🗑 Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Income;