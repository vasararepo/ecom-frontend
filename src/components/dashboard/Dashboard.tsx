import "../../assets/css/dashboard.css";
import OrdersChart from "./OrdersChart";


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Orders</p>
          <h2>1,248</h2>
          <span>+12 today</span>
        </div>

        <div className="stat-card">
          <p>Revenue</p>
          <h2>$24,320</h2>
          <span>This month</span>
        </div>

        <div className="stat-card">
          <p>eSIM Generated</p>
          <h2>892</h2>
          <span>Completed</span>
        </div>

        <div className="stat-card warning">
          <p>Pending Orders</p>
          <h2>36</h2>
          <span>Needs action</span>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="dashboard-row">
        <div className="card large">
          <h3>Orders Overview</h3>
          <OrdersChart />
        </div>

        <div className="card">
          <h3>Top Platforms</h3>
          <ul>
            <li>Shopee</li>
            <li>Lazada</li>
            <li>Website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
