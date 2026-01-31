import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";

const NAVBAR_HEIGHT = 56;
// Admin layout component that wraps admin pages
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="admin-layout"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#f5f8fb",
      }}
    >
      
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

    
      <main
        className={`orders-layout ${expanded ? "expanded" : ""}`}
        style={{
          flex: 1,
          overflowY: "auto",
          paddingTop: NAVBAR_HEIGHT - 16, 
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 24,
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
