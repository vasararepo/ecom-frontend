import axios, { AxiosError } from "axios";

import type { Order } from "../types/Order";
import type { OrderDetails, OrderItem, Product } from "../types/OrderDetails";

/* ================= AXIOS ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================= COMMON HEADERS ================= */

const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  return {
    Authorization: `Bearer ${token}`,
    email: email ?? "",
    "Content-Type": "application/json",
    "X-API-VERSION": "1",
    "x-correlationid": "1234567",
  };
};

/* ================= FETCH ORDER LIST ================= */

export const fetchOrdersApi = async (): Promise<Order[]> => {
  const res = await api.post(
    "/order/list",
    {},
    { headers: getHeaders() }
  );

  const content = res?.data?.data?.content;
  return Array.isArray(content) ? content : [];
};

/* ================= FETCH ORDER DETAILS ================= */

export const fetchOrderDetailsApi = async (
  orderId: string
): Promise<OrderDetails | null> => {
  try {
    const res = await api.post(
      "/order/details",
      { orderId },
      { headers: getHeaders() }
    );

    const raw = res?.data?.data;
    if (!raw || typeof raw !== "object") return null;

    return {
      orderId: String(raw.orderId),
      orderNumber: String(raw.orderNumber),
      platform: String(raw.platform),
      status: String(raw.status),
      orderDate:
    raw.orderDate ??
    raw.updatedAt ??
    null,

      totalAmount: Number(raw.totalAmount ?? 0),

      customerName:
        typeof raw.customerName === "string"
          ? raw.customerName
          : null,

      customerEmail:
        typeof raw.customerEmail === "string"
          ? raw.customerEmail
          : null,

      phoneNumber:
        typeof raw.phoneNumber === "string"
          ? raw.phoneNumber
          : null,

      orderItems: Array.isArray(raw.orderItems)
        ? raw.orderItems.map((item: any): OrderItem => ({
            orderItemId: String(item.orderItemId),
            unitPrice: Number(item.unitPrice ?? 0),
            quantity: Number(item.quantity ?? 0),
            totalPrice: Number(item.totalPrice ?? 0),

            product: item.product
              ? ({
                  productName: String(item.product.productName ?? ""),
                  productSku: String(item.product.productSku ?? ""),
                  category: String(item.product.category ?? ""),
                } as Product)
              : null,

            productInfo:
              "productInfo" in item ? item.productInfo : null,
          }))
        : [],
    };
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "Order details fetch failed:",
      err.response?.data || err.message
    );
    return null;
  }
};

/* ================= DOWNLOAD ORDERS ================= */

export const downloadOrdersXmlApi = async (): Promise<Blob> => {
  const res = await api.get("/order/download", {
    responseType: "blob",
    headers: getHeaders(),
  });

  return res.data;
};
