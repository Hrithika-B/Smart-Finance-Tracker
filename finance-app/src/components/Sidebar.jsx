import { Link } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPlusCircle,
  FaWallet,
  FaChartPie,
  FaBullseye
} from "react-icons/fa";

function Sidebar({ open }) {
  return (
    <div className={`sidebar ${open ? "open" : ""}`}>

  <div className="sidebar-title">
    💰 Smart Finance
  </div>

  <Link to="/dashboard"><FaHome /> Dashboard</Link>
  <Link to="/income"><FaMoneyBillWave /> Income</Link>
  <Link to="/budget"><FaPiggyBank /> Budget</Link>
  <Link to="/add"><FaPlusCircle /> Add Expense</Link>
  <Link to="/expenses"><FaWallet /> Expenses</Link>
  <Link to="/reports"><FaChartPie /> Reports</Link>
  <Link to="/goals"><FaBullseye /> Goals</Link>

</div>
  );
}

export default Sidebar;