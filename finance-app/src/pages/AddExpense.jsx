import { useState } from "react";
import {
  FaUtensils,
  FaBus,
  FaShoppingCart,
  FaHome,
  FaFileInvoiceDollar,
  FaFilm,
  FaHeartbeat,
  FaGraduationCap,
  FaEllipsisH
} from "react-icons/fa";

function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Rent",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Others"
  ];

  // Category → Icon mapping
  const categoryIcons = {
    Food: <FaUtensils />,
    Travel: <FaBus />,
    Shopping: <FaShoppingCart />,
    Rent: <FaHome />,
    Bills: <FaFileInvoiceDollar />,
    Entertainment: <FaFilm />,
    Health: <FaHeartbeat />,
    Education: <FaGraduationCap />,
    Others: <FaEllipsisH />
  };

  const finalCategory =
    category === "Others" ? customCategory : category;

  const add = async () => {
    const res = await fetch("http://localhost:5000/api/expense/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        title,
        amount,
        category: finalCategory,
        date: new Date(),
        userId: localStorage.getItem("userId")
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert("Expense Added");
      setTitle("");
      setAmount("");
      setCategory("");
      setCustomCategory("");
    }
  };

  return (
    <div className="page-card expense-page">
      <h2 className="page-title">Add Expense</h2>

      <div className="input-row">
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        {/* CATEGORY SELECT WITH ICONS */}
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select Category</option>

          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* SHOW ICON PREVIEW */}
        {category && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{categoryIcons[category]}</span>
            <span>{category}</span>
          </div>
        )}

        {/* CUSTOM CATEGORY */}
        {category === "Others" && (
          <input
            placeholder="Enter Custom Category"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
          />
        )}

        <button className="btn" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}

export default AddExpense;