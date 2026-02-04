import axios, { AxiosError } from "axios";

import type { Order } from "../types/Order";
import type {
  OrderDetails,
  OrderItem,
  Product,
} from "../types/OrderDetails";

/* ================= AXIOS ================= */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================= COMMON HEADERS ================= */

const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("userEmail");

  return {
    Authorization: token ? `Bearer ${token}` : "",
    email: email ?? "",
    "Content-Type": "application/json",
    "X-API-VERSION": "1",
    "x-correlationid": "1234567",
  };
};

/* ================= API DTO TYPES ================= */

type ProductApi = {
  productSku?: string;
  category?: string;
  productName?: string;
  description?: string;
};

type OrderItemApi = {
  orderItemId: string | number;
  unitPrice?: number;
  quantity?: number;
  totalPrice?: number;
  product?: ProductApi;
  productInfo?: unknown;
};

type OrderDetailsApi = {
  orderId: string | number;
  orderNumber?: string | number;
  platform?: string;
  status?: string;
  orderDate?: string;
  updatedAt?: string;
  totalAmount?: number;
  customerName?: string;
  customerEmail?: string;
  phoneNumber?: string;
  orderItems?: OrderItemApi[];
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

    const raw: OrderDetailsApi | null =
      res?.data?.data ?? null;

    if (!raw) return null;

    const orderItems: OrderItem[] = Array.isArray(
      raw.orderItems
    )
      ? raw.orderItems.map((item): OrderItem => {
          const sku =
            typeof item.product?.productSku === "string"
              ? item.product.productSku
              : "";

          const product: Product | null = item.product
            ? {
                productId: sku || String(item.orderItemId),
                productSku: sku,
                category:
                  item.product.category ?? "",
                productName:
                  item.product.productName ?? "",
                description:
                  item.product.description,
              }
            : null;

          return {
            orderItemId: String(item.orderItemId),
            unitPrice: Number(item.unitPrice ?? 0),
            quantity: Number(item.quantity ?? 0),
            totalPrice: Number(item.totalPrice ?? 0),
            product,
            productInfo: item.productInfo ?? null,
          };
        })
      : [];

    return {
      orderId: String(raw.orderId),
      orderNumber: String(raw.orderNumber ?? ""),
      platform: raw.platform ?? "",
      status: raw.status ?? "",
      orderDate:
        raw.orderDate ??
        raw.updatedAt ??
        null,
      totalAmount: Number(raw.totalAmount ?? 0),

      customerName: raw.customerName ?? null,
      customerEmail: raw.customerEmail ?? null,
      phoneNumber: raw.phoneNumber ?? null,

      orderItems,
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
