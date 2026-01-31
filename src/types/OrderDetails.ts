export interface Product {
  productId: string;
  productSku: string;
  category: string;
  productName: string;
  description?: string;
}

export interface OrderItem {
  orderItemId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  product: Product | null;
  productInfo: unknown | null;
}

export interface OrderDetails {
  orderId: string;
  orderNumber: string;
  platform: string;
  status: string;
  orderDate: string | null;
  totalAmount: number;

  customerName: string | null;
  customerEmail?: string | null;
  phoneNumber: string | null;

  orderItems: OrderItem[];
}
