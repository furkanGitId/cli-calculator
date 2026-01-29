import { useEffect, useState, useCallback } from "react";
import { deleteHistory,truncateHistory } from "../api/calculatorApi";

const PAGE_SIZE = 5;

export default function HistoryTable({ data, onDeleted, onRowClick }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleTruncate = useCallback(async () => {
    if (data.length === 0) return;

    const message = "Are you sure you want to delete ALL calculation history?";
    if (!window.confirm(message)) return;

    setLoading(true);
    try {
      await truncateHistory();
      setSelectedIds([]);
      onDeleted(); // refresh parent
    } catch (err) {
      console.error("Truncate failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }, [data, onDeleted]);

  const handleDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;

    const message = `Are you sure you want to delete ${selectedIds.length} record(s)?`;

    // Native browser confirm
    if (!window.confirm(message)) {
      return;
    }

    setLoading(true);
    try {
      await deleteHistory(selectedIds);
      setSelectedIds([]);
      onDeleted(); // refresh parent
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedIds, onDeleted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete" && selectedIds.length > 0 && !loading) {
        e.preventDefault();
        handleDelete();
      }

      // CTRL + A → select all
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setSelectedIds(data.map((row) => row.id));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, data, loading, handleDelete]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    setSelectedIds(
      selectedIds.length === data.length ? [] : data.map((row) => row.id),
    );
  };

  return (
    <>
      {/* Actions */}
      <div className="d-flex justify-content-between mb-2">
        <div>
          <button
            className="btn btn-danger btn-sm me-2"
            disabled={selectedIds.length === 0 || loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Delete Selected"}
          </button>

          <button
            className="btn btn-danger btn-sm"
            disabled={data.length === 0 || loading}
            onClick={handleTruncate}
          >
            {loading ? "Processing..." : "Truncate All"}
          </button>
        </div>
        <span className="text-muted">{selectedIds.length} selected</span>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === data.length && data.length > 0
                  }
                  onChange={selectAll}
                />
              </th>
              <th>Expression</th>
              <th>Result</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                style={{ cursor: "pointer" }}
                onClick={() => onRowClick(row)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td>{row.expression}</td>
                <td>{row.result}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
                <td>{new Date(row.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-3">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}
