import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Reports() {
  const [list, setList] = useState([]);
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const reportRef = useRef();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(
      `http://localhost:5000/api/expense/list?userId=${userId}`,
      {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (e) =>
            e.date &&
            e.date.startsWith(month)
        );

        setList(filtered);
      });
  }, [month]);

  // TOTAL
  const total = list.reduce(
    (a, b) => a + Number(b.amount),
    0
  );

  // CATEGORY TOTAL
  const byCategory = {};

  list.forEach((e) => {
    byCategory[e.category] =
      (byCategory[e.category] || 0) +
      Number(e.amount);
  });

  // CHART DATA
  const chartData = {
    labels: Object.keys(byCategory),

    datasets: [
      {
        data: Object.values(byCategory),

        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4"
        ],

        borderWidth: 1
      }
    ]
  };

  // DOWNLOAD PDF
  const downloadPDF = async () => {
    const canvas = await html2canvas(
      reportRef.current
    );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF(
      "p",
      "mm",
      "a4"
    );

    const width = 190;

    const height =
      (canvas.height * width) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      10,
      10,
      width,
      height
    );

    pdf.save(`report-${month}.pdf`);
  };

  return (
    <div className="page-card">

      {/* HEADER */}
      <h2 className="page-title">
        📊 Reports
      </h2>

      {/* TOP CONTROLS */}
      <div className="input-row">

        <input
          type="month"
          value={month}
          onChange={(e) =>
            setMonth(e.target.value)
          }
        />

        <button
          className="btn"
          onClick={downloadPDF}
        >
          Download PDF
        </button>

      </div>

      {/* REPORT CONTENT */}
      <div ref={reportRef}>

        {/* SUMMARY CARD */}
       <div className="report-summary">

  <h2>📊 Expense Analytics</h2>

  <p className="report-month">
    Report Month: {month}
  </p>

  <div className="total-box">

    <small>Total Spending</small>

    <h1>
      ₹{total.toLocaleString()}
    </h1>

  </div>

</div>

        {/* CHART */}
        <div className="chart-common">

          <Doughnut
            data={chartData}
            options={{
              maintainAspectRatio: false
            }}
          />

        </div>

        {/* CATEGORY */}
        <h3 className="category-heading">
  By Category
</h3>

<div className="category-grid">

  {Object.keys(byCategory).map((c) => (

    <div className="category-card" key={c}>

      <h4>{c}</h4>

      <p>
        ₹{byCategory[c].toLocaleString()}
      </p>

    </div>

  ))}

</div>

        {/* EXPENSE LIST */}
        <h4 className="expense-heading">
  All Expenses
</h4>

{list.map(e => (
  <div key={e._id}>
    {e.date?.slice(0,10)} - {e.title} - ₹{e.amount} ({e.category})
  </div>
))}

      </div>

    </div>
  );
}

export default Reports;