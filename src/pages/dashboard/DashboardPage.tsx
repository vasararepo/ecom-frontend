import Navbar from "../../components/navbar/Navbar";
import AdminLayout from "../../layout/AdminLayout";
import Dashboard from "../../components/dashboard/Dashboard";
import "../../assets/css/OrderPage.css";


const DashboardPage = () => {
  return (
    <>
      <Navbar />

      <AdminLayout>
        <div className="order-page">
          <h1 className="page-title">Dashboard</h1>

          <div className="orders-card">
            <Dashboard />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default DashboardPage;
