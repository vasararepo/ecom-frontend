import { useMemo, useState } from "react";
import "@/assets/css/SelectModal.css";

/* ================= TYPES ================= */

export type SelectItem = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  items: SelectItem[];
  multiple?: boolean;                 
  selectedIds: string[];
  onCancel: () => void;
  onConfirm: (ids: string[]) => void;
};

/* ================= COMPONENT ================= */

const SelectModal = ({
  title,
  items,
  multiple = false,
  selectedIds,
  onCancel,
  onConfirm,
}: Props) => {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] =
    useState<string[]>(selectedIds);

  /* ================= SEARCH ================= */

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;

    return items.filter((i) =>
      i.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [items, search]);

  /* ================= SELECTION ================= */

  const toggle = (id: string) => {
    if (multiple) {
      setTempSelected((prev) =>
        prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id]
      );
    } else {
      setTempSelected([id]);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>

        {/* SEARCH */}
        <div className="modal-search">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* LIST */}
        <div className="modal-body">
          {filteredItems.length === 0 ? (
            <p className="empty">No results</p>
          ) : (
            filteredItems.map((item) => (
              <label key={item.id} className="modal-item">
                <input
                  type={multiple ? "checkbox" : "radio"}
                  checked={tempSelected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                />
                <span>{item.label}</span>
              </label>
            ))
          )}
        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="text-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={() => onConfirm(tempSelected)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;
