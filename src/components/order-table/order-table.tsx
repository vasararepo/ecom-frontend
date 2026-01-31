import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import "../../assets/css/order-table.css";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MailIcon from "@mui/icons-material/Mail";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import Pagination from "../Pagination/Pagination";
import ExpandedRow from "./expanded-row";

import { fetchOrderDetailsApi } from "../../api/order.api";
import { mapOrderDetailsApiToUi } from "../../mappers/orderDetails.mapper";

import type { Order } from "../../types/Order";
import type { OrderDetails } from "../../types/OrderDetails";

/* ================= TYPES ================= */

type Props = {
  orders: Order[];
};

const PAGE_SIZE = 7;

/* ================= COMPONENT ================= */

const OrderTable = ({ orders }: Props) => {
  const [expandedOrderId, setExpandedOrderId] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const [detailsMap, setDetailsMap] =
    useState<Record<string, OrderDetails | null>>({});

  const [detailsLoading, setDetailsLoading] =
    useState<Record<string, boolean>>({});

  const [selectedProductIndexMap, setSelectedProductIndexMap] =
    useState<Record<string, number>>({});

  /* ===== CHECKBOX STATE ===== */
  const [selectedOrders, setSelectedOrders] =
    useState<Record<string, boolean>>({});

  /* ============== RESET ON DATA CHANGE ============== */
  useEffect(() => {
    setCurrentPage(1);
    setExpandedOrderId(null);
    setSelectedOrders({});
  }, [orders]);

  /* ================= PAGINATION ================= */

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(orders.length / PAGE_SIZE)),
    [orders.length]
  );

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, currentPage]);

  /* ================= CHECKBOX ================= */

  const toggleSelectOne = useCallback((orderId: string) => {
    setSelectedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  }, []);

  /* ================= EXPAND ROW ================= */

  const toggleRow = useCallback(
    async (orderId: string) => {
      const isClosing = expandedOrderId === orderId;
      setExpandedOrderId(isClosing ? null : orderId);

      if (isClosing) return;

      setSelectedProductIndexMap((p) => ({
        ...p,
        [orderId]: 0,
      }));

      if (!detailsMap[orderId]) {
        try {
          setDetailsLoading((p) => ({
            ...p,
            [orderId]: true,
          }));

          const raw = await fetchOrderDetailsApi(orderId);
          const mapped =
            raw ? mapOrderDetailsApiToUi(raw) : null;

          setDetailsMap((p) => ({
            ...p,
            [orderId]: mapped,
          }));
        } catch (err) {
          console.error("Failed to fetch order details", err);
        } finally {
          setDetailsLoading((p) => ({
            ...p,
            [orderId]: false,
          }));
        }
      }
    },
    [expandedOrderId, detailsMap]
  );

  /* ================= EMPTY ================= */

  if (orders.length === 0) {
    return (
      <div className="table-center">
        No orders found
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Platform</th>
              <th>Order Number</th>
              <th>Product</th>
              <th className="center">Quantity</th>
              <th className="center">Status</th>
              <th>Total</th>
              <th className="center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((o) => {
              const isExpanded =
                expandedOrderId === o.orderId;

              const details = detailsMap[o.orderId];
              const index =
                selectedProductIndexMap[o.orderId] ?? 0;

              return (
                <Fragment key={o.orderId}>
                  {/* MAIN ROW */}
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(
                          selectedOrders[o.orderId]
                        )}
                        onChange={() =>
                          toggleSelectOne(o.orderId)
                        }
                      />
                    </td>

                    <td>{o.platform}</td>
                    <td>{o.orderNumber}</td>
                    <td title={o.productName}>
                      {o.productName}
                    </td>
                    <td className="center">
                      {o.quantity}
                    </td>
                    <td className="center">
                      <span
                        className={`status ${String(
                          o.status ?? ""
                        ).toLowerCase()}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>
                      $
                      {Number(
                        o.totalAmount ?? 0
                      ).toFixed(2)}
                    </td>
                    <td className="actions center">
                      <AssignmentTurnedInIcon className="action-icon success" />
                      <QrCodeIcon className="action-icon qr" />
                      <MailIcon className="action-icon mail" />
                      <span
                        className="expand-icon"
                        onClick={() =>
                          toggleRow(o.orderId)
                        }
                      >
                        {isExpanded ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </span>
                    </td>
                  </tr>

                  {/* EXPANDED */}
                  {isExpanded && (
                    <ExpandedRow
                      details={details}
                      loading={Boolean(
                        detailsLoading[o.orderId]
                      )}
                      index={index}
                      totalItems={
                        details?.orderItems?.length || 0
                      }
                      onPrev={() =>
                        setSelectedProductIndexMap((p) => ({
                          ...p,
                          [o.orderId]: Math.max(
                            0,
                            index - 1
                          ),
                        }))
                      }
                      onNext={() =>
                        setSelectedProductIndexMap((p) => ({
                          ...p,
                          [o.orderId]: Math.min(
                            index + 1,
                            (details?.orderItems?.length ||
                              1) - 1
                          ),
                        }))
                      }
                    />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default React.memo(OrderTable);
