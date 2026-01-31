export interface Order {
  orderId: string;
  platform: string;
  orderNumber: string;
  productType: string;
  productName: string;
  quantity: number;
  customerEmail: string | null;
  orderDate: string; 
  status: string;
  updatedAt: string;
  totalAmount: number;
}

export interface OrderListResponse {
  success: boolean;
  message: string;
  responseCode: string;
  data: {
    content: Order[];
  };
}

export interface Product {
  productId: string;
  productSku: string;
  category: string;
  productName: string;
  description: string;
  isActive: boolean;
}

export interface OrderItem {
  orderItemId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  product: Product;
  productInfo: unknown | null;
}

export interface Order {
  orderId: string;
  platform: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  customerEmail: string | null;
  orderDate: string;
  status: string;
  updatedAt: string;
  totalAmount: number;
}

