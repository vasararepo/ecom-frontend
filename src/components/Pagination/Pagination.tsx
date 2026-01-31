import React, { useCallback, useMemo } from "react";
import "../../assets/css/Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}



const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {


  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);



  const goPrev = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const goNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const goToPage = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, onPageChange]
  );

  /* ================= UI ================= */

  return (
    <div className="pagination">
      {/* PREVIOUS */}
      <span
        className={currentPage === 1 ? "disabled" : ""}
        onClick={goPrev}
      >
        ◀
      </span>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <span
          key={page}
          className={currentPage === page ? "active" : ""}
          onClick={() => goToPage(page)}
        >
          {page}
        </span>
      ))}

      {/* NEXT */}
      <span
        className={currentPage === totalPages ? "disabled" : ""}
        onClick={goNext}
      >
        ▶
      </span>
    </div>
  );
};



export default React.memo(Pagination);
