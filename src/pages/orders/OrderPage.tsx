import { useEffect, useMemo, useState, useCallback } from "react";
import Navbar from "../../components/navbar/Navbar";
import OrderTable from "../../components/order-table/order-table";
import AdminLayout from "../../layout/AdminLayout";
import "../../assets/css/OrderPage.css";
import DownloadIcon from "@mui/icons-material/Download";

import { fetchOrdersApi } from "../../api/order.api";
import type { Order } from "../../types/Order";

/* ================= COMPONENT ================= */

const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>("All");
  const [date, setDate] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [productType, setProductType] = useState<string>("");

  const [downloading, setDownloading] = useState<boolean>(false);

  /* ================= LOAD ORDERS ================= */

  const loadOrders = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await fetchOrdersApi();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /* ================= FILTERED ORDERS (MEMOIZED) ================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // STATUS
      if (activeTab !== "All") {
        if (
          String(o.status ?? "").toLowerCase() !==
          activeTab.toLowerCase()
        ) {
          return false;
        }
      }

      // DATE
      if (date) {
        const raw = o.orderDate ?? o.updatedAt;
        if (!raw) return false;

        const d = new Date(raw);
        if (Number.isNaN(d.getTime())) return false;

        const formatted = d.toISOString().split("T")[0];
        if (formatted !== date) return false;
      }

      // PLATFORM
      if (platform) {
        if (
          String(o.platform ?? "").toLowerCase() !==
          platform.toLowerCase()
        ) {
          return false;
        }
      }

      // PRODUCT TYPE
      if (productType) {
        const source =
          o.productType ??
          o.productName ??
          "";

        if (
          !String(source)
            .toLowerCase()
            .includes(productType.toLowerCase())
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, date, platform, productType]);

  /* ================= HANDLERS (MEMOIZED) ================= */

  const handleReset = useCallback((): void => {
    setActiveTab("All");
    setDate("");
    setPlatform("");
    setProductType("");
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDate(e.target.value);
    },
    []
  );

  const handlePlatformChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPlatform(e.target.value);
    },
    []
  );

  const handleProductTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setProductType(e.target.value);
    },
    []
  );

  /* ================= CSV HELPERS ================= */

  const csvEscape = useCallback((value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    return `"${str.replace(/"/g, '""')}"`;
  }, []);

  const handleDownload = useCallback(async (): Promise<void> => {
    try {
      setDownloading(true);

      const headers = [
        "OrderId",
        "OrderNumber",
        "Platform",
        "ProductName",
        "ProductType",
        "Quantity",
        "Status",
        "OrderDate",
        "TotalAmount",
        "CustomerEmail",
      ];

      let csv = "\uFEFF" + headers.join(",") + "\n";

      for (const o of filteredOrders) {
        const row = [
          csvEscape(o.orderId),
          csvEscape(o.orderNumber),
          csvEscape(o.platform),
          csvEscape(o.productName),
          csvEscape(o.productType ?? ""),
          csvEscape(o.quantity),
          csvEscape(o.status),
          csvEscape(o.orderDate ?? o.updatedAt ?? ""),
          csvEscape(o.totalAmount),
          csvEscape(o.customerEmail ?? ""),
        ];

        csv += row.join(",") + "\n";
      }

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");

      a.href = url;
      a.download = `orders-${now.getFullYear()}${pad(
        now.getMonth() + 1
      )}${pad(now.getDate())}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to prepare download");
    } finally {
      setDownloading(false);
    }
  }, [filteredOrders, csvEscape]);

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <AdminLayout>
        <div className="order-page">
          <h1 className="page-title">Orders</h1>

          <div className="orders-card">
            {/* TABS */}
            <div className="order-tabs">
              {[
                "All",
                "Created",
                "Processed",
                "Email_Sent",
                "ESIM_Generated",
                "Cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`tab ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* FILTERS */}
            <div className="filters-row">
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
              />

              <select
                value={platform}
                onChange={handlePlatformChange}
              >
                <option value="">Platform</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
              </select>

              <select
                value={productType}
                onChange={handleProductTypeChange}
              >
                <option value="">Product type</option>
                <option value="eSIM">eSIM</option>
              </select>

              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>

              <button
                className="download-btn"
                onClick={handleDownload}
                disabled={downloading}
              >
                <DownloadIcon />
                {downloading ? "Preparing..." : "Download"}
              </button>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="table-center">
                Loading orders...
              </div>
            ) : (
              <OrderTable orders={filteredOrders} />
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default OrderPage;
