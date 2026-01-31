import type { OrderDetails } from "../types/OrderDetails";
import type { OrderItem } from "../types/Order";

export const mapOrderDetailsApiToUi = (raw: any): OrderDetails => {
  return {
    
    orderId: String(raw.orderId ?? ""),

    orderNumber: String(raw.orderNumber ?? ""),
    status: String(raw.status ?? ""),
    platform: String(raw.platform ?? ""),
    orderDate: raw.orderDate ?? null,
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
          orderItemId: String(item.orderItemId ?? ""),
          unitPrice: Number(item.unitPrice ?? 0),
          quantity: Number(item.quantity ?? 0),
          totalPrice: Number(item.totalPrice ?? 0),

       
          product: item.product
            ? {
                productId: String(item.product.productId ?? ""),
                productSku: String(item.product.productSku ?? ""),
                category: String(item.product.category ?? ""),
                productName: String(item.product.productName ?? ""),
                description: String(item.product.description ?? ""),
                isActive: Boolean(item.product.isActive ?? true),
              }
            : {
                productId: "",
                productSku: "",
                category: "",
                productName: "",
                description: "",
                isActive: false,
              },

          productInfo:
            "productInfo" in item ? item.productInfo ?? null : null,
        }))
      : [],
  };
};
