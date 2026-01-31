import Navbar from "../../components/navbar/navbar";
import AdminLayout from "../../layout/AdminLayout";
import Dashboard from "../../components/dashboard/dashboard";
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
