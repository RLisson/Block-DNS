import React from 'react';
import './PaginationControls.css';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onLimitChange: (limit: number) => void;
  currentLimit: number;
  total: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  onNext,
  onPrev,
  onLimitChange,
  currentLimit,
  total
}) => {
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar startPage se estivermos no final
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span>
          Mostrando {((currentPage - 1) * currentLimit) + 1} a {Math.min(currentPage * currentLimit, total)} de {total} resultados
        </span>
        
        <select 
          value={currentLimit} 
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="limit-selector"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
        </select>
      </div>

      <div className="pagination-buttons">
        <button 
          onClick={onPrev} 
          disabled={!hasPrev}
          className="pagination-btn prev-btn"
        >
          ← Anterior
        </button>

        <div className="page-numbers">
          {currentPage > 3 && (
            <>
              <button 
                onClick={() => onPageChange(1)}
                className="pagination-btn page-btn"
              >
                1
              </button>
              {currentPage > 4 && <span className="pagination-dots">...</span>}
            </>
          )}

          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-btn page-btn ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="pagination-dots">...</span>}
              <button 
                onClick={() => onPageChange(totalPages)}
                className="pagination-btn page-btn"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button 
          onClick={onNext} 
          disabled={!hasNext}
          className="pagination-btn next-btn"
        >
          Próxima →
        </button>
      </div>

      <div className="pagination-summary">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default PaginationControls;