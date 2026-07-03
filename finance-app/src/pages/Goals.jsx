import { useEffect, useState } from "react";

function Goals() {

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState("short");

  const [list, setList] = useState([]);

  const [amountMap, setAmountMap] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  /* =========================
     LOAD GOALS
  ========================= */
  const load = () => {

    fetch(
      `http://localhost:5000/api/goal/list?userId=${userId}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )
      .then(r => r.json())
      .then(d => setList(d));

  };

  useEffect(load, []);

  /* =========================
     ADD GOAL
  ========================= */
  const addGoal = async () => {

    const res = await fetch(
      "http://localhost:5000/api/goal/add",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },

        body: JSON.stringify({
          userId,
          title,
          targetAmount: Number(target),
          type
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add goal");
      return;
    }

alert(

  `Goal added successfully\nRemaining Budget: ₹${data.remainingBudget || 0}`

);
    setTitle("");
    setTarget("");

    load();
  };

  /* =========================
     ADD MONEY TO GOAL
  ========================= */
  const addToGoal = async (id) => {

    const res = await fetch(
      "http://localhost:5000/api/goal/add-amount",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },

        body: JSON.stringify({
          goalId: id,
          amount: Number(amountMap[id] || 0)
        })
      }
    );

    const data = await res.json();

    /* ❌ ERROR */
    if (!res.ok) {
      alert(data.error);
      return;
    }

    /* ✅ SUCCESS */
    
      alert(
  "Amount added successfully"
);
  

    setAmountMap({
      ...amountMap,
      [id]: ""
    });

    load();
  };

  /* =========================
     DELETE GOAL
  ========================= */
  const deleteGoal = async (id) => {

    if (!window.confirm("Delete this goal?")) {
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/goal/delete/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert("Goal deleted successfully");

    load();
  };

  /* =========================
     PERCENT CALCULATION
  ========================= */
  const getPercent = (saved, target) => {

    if (!target || target === 0) {
      return 0;
    }

    return Math.min(
      (saved / target) * 100,
      100
    );
  };

  return (
    <div className="goals-page">

      <h2 className="page-title">
        Goals
      </h2>

      {/* =========================
          ADD GOAL
      ========================= */}
      <div className="input-row">

        <input
          placeholder="Title"
          value={title}
          onChange={e =>
            setTitle(e.target.value)
          }
        />

        <input
          placeholder="Target Amount"
          value={target}
          onChange={e =>
            setTarget(e.target.value)
          }
        />

        <select
          value={type}
          onChange={e =>
            setType(e.target.value)
          }
        >
          <option value="short">
            Short Term
          </option>

          <option value="long">
            Long Term
          </option>
        </select>

        <button
          className="btn"
          onClick={addGoal}
        >
          Add Goal
        </button>

      </div>

      <h3>Your Goals</h3>

      {/* =========================
          GOALS LIST
      ========================= */}
      {list.map((g) => {

        const isCompleted =
          Number(g.savedAmount) >=
          Number(g.targetAmount);

       const percent = getPercent(
  Number(g.savedAmount || 0),
  Number(g.targetAmount || 0)
);

        return (

          <div
            key={g._id}
            className="goal-card"
          >

            {/* HEADER */}
            <div className="goal-head">

              <b>{g.title}</b>
              {" "}
              ({g.type})

            </div>

            {/* PROGRESS BAR */}
            <div className="goal-bar">

              <div
                style={{
                  width: `${percent}%`,
                  background:
                    isCompleted
                      ? "green"
                      : g.type === "short"
                      ? "#f59e0b"
                      : "#2563eb",

                  height: "100%"
                }}
              />

            </div>

            {/* DETAILS */}
            <small>

              ₹{g.savedAmount}
              {" / "}
              ₹{g.targetAmount}

              {" "}
              ({percent.toFixed(0)}%)

            </small>

            {/* COMPLETED */}
            {isCompleted && (

              <p
                style={{
                  color: "green",
                  fontWeight: "bold"
                }}
              >
                🎉 Goal Completed (Locked)
              </p>

            )}

            {/* ACTIONS */}
            <div className="input-row">

              <input
                placeholder={
                  isCompleted
                    ? "Goal Completed 🔒"
                    : "Add amount"
                }

                value={
                  amountMap[g._id] || ""
                }

                onChange={e =>
                  setAmountMap({
                    ...amountMap,
                    [g._id]:
                      e.target.value
                  })
                }

                disabled={isCompleted}

                style={{
                  background:
                    isCompleted
                      ? "#f3f3f3"
                      : "white",

                  cursor:
                    isCompleted
                      ? "not-allowed"
                      : "text"
                }}
              />

              {/* ADD BUTTON */}
              <button
                className="btn"

                onClick={() =>
                  addToGoal(g._id)
                }

                disabled={isCompleted}

                style={{
                  opacity:
                    isCompleted
                      ? 0.5
                      : 1,

                  cursor:
                    isCompleted
                      ? "not-allowed"
                      : "pointer"
                }}
              >
                Add
              </button>

              {/* DELETE BUTTON */}
              <button
                className="btn btn-danger"

                onClick={() =>
                  deleteGoal(g._id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        );
      })}
    </div>
  );
}

export default Goals;