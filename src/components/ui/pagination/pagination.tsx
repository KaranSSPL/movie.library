import React from 'react';
import { usePagination, DOTS } from '@/utils/usePagination';
import styles from './Pagination.module.scss';

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  
  return (
    <ul className={styles.paginationContainer}>
      <li
        className={`${styles.paginationItem} ${currentPage === 1 ? styles.disabled : ''}`}
        onClick={onPrevious}
      >
        <span className={styles.pageText}>Prev</span>
      </li>
      {paginationRange.map((pageNumber: number | string, index: number) => {
        if (pageNumber === DOTS) {
          return <li key={index} className={`${styles.paginationItem} ${styles.dots}`}>&#8230;</li>;
        }

        return (
          <li
            key={index}
            className={`${styles.paginationItem} ${pageNumber === currentPage ? styles.selected : ''}`}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`${styles.paginationItem} ${currentPage === lastPage ? styles.disabled : ''}`}
        onClick={onNext}
      >
        <span className={styles.pageText}>Next</span>
      </li>
    </ul>
  );
};

export default Pagination;
