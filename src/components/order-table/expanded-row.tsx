import React from "react";
import type { OrderDetails } from "../../types/OrderDetails";

/* ================= PROPS ================= */

type Props = {
  details: OrderDetails | null;
  loading?: boolean;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  totalItems?: number;
};

/* ================= COMPONENT ================= */

const ExpandedRow: React.FC<Props> = ({
  details,
  loading = false,
  index,
  onPrev,
  onNext,
  totalItems,
}) => {
  const itemsLen =
    typeof totalItems === "number"
      ? totalItems
      : details?.orderItems?.length ?? 0;

  return (
    <tr className="expanded-row">
      <td colSpan={8}>
        <div className="expanded-content horizontal">
          {/* ITEM NAVIGATION */}
          {itemsLen > 1 && (
            <div className="item-nav-top">
              <button disabled={index === 0} onClick={onPrev}>
                ‹
              </button>

              <span>
                Item {index + 1} of {itemsLen}
              </span>

              <button
                disabled={index === itemsLen - 1}
                onClick={onNext}
              >
                ›
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div style={{ padding: 16 }}>
              Loading details...
            </div>
          ) : details ? (
            <>
              {/* ORDER INFO */}
              <div className="expand-section">
                <h4>Order Information</h4>
                <p>
                  <b>Order Number:</b>{" "}
                  {details.orderNumber}
                </p>
                <p>
                  <b>Status:</b> {details.status}
                </p>
                <p>
                  <b>Platform:</b> {details.platform}
                </p>
                <p>
                  <b>Order Date:</b>{" "}
                  {details.orderDate
                    ? new Date(
                        details.orderDate
                      ).toLocaleString()
                    : "—"}
                </p>
              </div>

              {/* PRODUCT INFO */}
              <div className="expand-section">
                <h4>Product Information</h4>

                {details.orderItems?.[index] ? (
                  <>
                    <p>
                      <b>Name:</b>{" "}
                      {
                        details.orderItems[index]
                          .product?.productName
                      }
                    </p>
                    <p>
                      <b>SKU:</b>{" "}
                      {
                        details.orderItems[index]
                          .product?.productSku
                      }
                    </p>
                    <p>
                      <b>Category:</b>{" "}
                      {
                        details.orderItems[index]
                          .product?.category
                      }
                    </p>
                    <p>
                      <b>Qty:</b>{" "}
                      {
                        details.orderItems[index]
                          .quantity
                      }
                    </p>
                  </>
                ) : (
                  <p>No product data</p>
                )}
              </div>

              {/* CUSTOMER INFO */}
              <div className="expand-section">
                <h4>Customer Information</h4>
                <p>
                  <b>Name:</b>{" "}
                  {details.customerName || "—"}
                </p>
                <p>
                  <b>Email:</b>{" "}
                  {details.customerEmail ?? "—"}
                </p>
                <p>
                  <b>Phone:</b>{" "}
                  {details.phoneNumber ?? "—"}
                </p>
              </div>

              {/* PAYMENT INFO */}
              <div className="expand-section">
                <h4>Payment</h4>
                <p>
                  <b>Total Amount:</b>{" "}
                  $
                  {Number(
                    details.totalAmount
                  ).toFixed(2)}
                </p>
                <p>
                  <b>Status:</b> {details.status}
                </p>
              </div>
            </>
          ) : (
            <div style={{ padding: 16 }}>
              No details available
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default React.memo(ExpandedRow);
