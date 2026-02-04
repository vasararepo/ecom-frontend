import type {
  OrderDetails,
  OrderItem,
  Product,
} from "../types/OrderDetails";

/* ================= API DTO TYPES ================= */

type ProductApi = {
  productId?: string | number;
  productSku?: string;
  category?: string;
  productName?: string;
  description?: string;
};

type OrderItemApi = {
  orderItemId?: string | number;
  unitPrice?: number;
  quantity?: number;
  totalPrice?: number;
  product?: ProductApi;
  productInfo?: unknown;
};

type OrderDetailsApi = {
  orderId?: string | number;
  orderNumber?: string | number;
  status?: string;
  platform?: string;
  orderDate?: string;
  totalAmount?: number;

  customerName?: string;
  customerEmail?: string;
  phoneNumber?: string;

  orderItems?: OrderItemApi[];
};

/* ================= MAPPER ================= */

export const mapOrderDetailsApiToUi = (
  raw: OrderDetailsApi | null
): OrderDetails => {
  const orderItems: OrderItem[] = Array.isArray(raw?.orderItems)
    ? raw.orderItems.map(
        (item): OrderItem => {
          const product: Product | null = item.product
            ? {
                productId: String(
                  item.product.productId ??
                    item.product.productSku ??
                    ""
                ),
                productSku:
                  item.product.productSku ?? "",
                category:
                  item.product.category ?? "",
                productName:
                  item.product.productName ?? "",
                description:
                  item.product.description,
              }
            : null;

          return {
            orderItemId: String(
              item.orderItemId ?? ""
            ),
            unitPrice: Number(
              item.unitPrice ?? 0
            ),
            quantity: Number(
              item.quantity ?? 0
            ),
            totalPrice: Number(
              item.totalPrice ?? 0
            ),
            product,
            productInfo:
              item.productInfo ?? null,
          };
        }
      )
    : [];

  return {
    orderId: String(raw?.orderId ?? ""),
    orderNumber: String(
      raw?.orderNumber ?? ""
    ),
    status: String(raw?.status ?? ""),
    platform: String(
      raw?.platform ?? ""
    ),
    orderDate:
      raw?.orderDate ?? null,
    totalAmount: Number(
      raw?.totalAmount ?? 0
    ),

    customerName:
      typeof raw?.customerName ===
      "string"
        ? raw.customerName
        : null,

    customerEmail:
      typeof raw?.customerEmail ===
      "string"
        ? raw.customerEmail
        : null,

    phoneNumber:
      typeof raw?.phoneNumber ===
      "string"
        ? raw.phoneNumber
        : null,

    orderItems,
  };
};
