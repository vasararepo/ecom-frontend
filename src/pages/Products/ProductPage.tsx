import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import AdminLayout from "../../layout/AdminLayout";
import "../../assets/css/Product.css";
import type { Product } from "../../types/Products";
import AddEditProductModal from "../../components/Products/AddEditProductModal";

/* ================= DUMMY DATA ================= */

const initialProducts: Product[] = [
  {
    id: "1",
    name: "eSIM Europe",
    type: "eSIM",
    price: 29.99,
    stock: 120,
    status: "Active",
  },
  {
    id: "2",
    name: "eSIM Asia",
    type: "eSIM",
    price: 24.99,
    stock: 80,
    status: "Inactive",
  },
];

/* ================= COMPONENT ================= */

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (data: Product) => {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === data.id ? data : p))
      );
    } else {
      setProducts((prev) => [...prev, data]);
    }
    setOpen(false);
  };

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <AdminLayout>
        <div className="products-page">
          <h1 className="page-title">Products</h1>

          <div className="products-card">
            <button className="add-btn" onClick={handleAdd}>
              + Add Product
            </button>

            <table className="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="table-center">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>${p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <span
                          className={`status ${p.status.toLowerCase()}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="center">
                        <button onClick={() => handleEdit(p)}>
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {open && (
            <AddEditProductModal
              product={editing}
              onClose={() => setOpen(false)}
              onSave={handleSave}
            />
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default ProductsPage;
