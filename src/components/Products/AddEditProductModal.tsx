import { useEffect, useState } from "react";
import "../../assets/css/ProductModal.css";
import type { Product } from "../../types/Products";

/* ================= PROPS ================= */

type Props = {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
};

/* ================= COMPONENT ================= */

const AddEditProductModal = ({ product, onSave, onClose }: Props) => {
  const [form, setForm] = useState<Product>({
    id: "",
    name: "",
    type: "",
    price: 0,
    stock: 0,
    status: "Active",
  });

  /* ================= INIT FORM ================= */

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        id: Date.now().toString(),
        name: "",
        type: "",
        price: 0,
        stock: 0,
        status: "Active",
      });
    }
  }, [product]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.type.trim()) {
      alert("Product name and type are required");
      return;
    }

    if (form.price < 0 || form.stock < 0) {
      alert("Price and stock must be positive numbers");
      return;
    }

    onSave(form);
  };

  /* ================= UI ================= */

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{product ? "Edit Product" : "Add Product"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="type"
          placeholder="Product Type"
          value={form.type}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="modal-actions">
          <button onClick={handleSubmit}>
            {product ? "Update" : "Create"}
          </button>

          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProductModal;
