type PaginationProps = {
  currentPage: number;   // 0-based
  totalPages: number;    // 전체 페이지 수
  onPageChange: (page: number) => void;
};

const PAGE_GROUP_SIZE = 10;

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // 1-based 표시용
  const currentPageNumber = currentPage + 1;

  // 페이지 번호 그룹 (번호 표시용)
  const startPage =
    Math.floor((currentPageNumber - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;

  let endPage = startPage + PAGE_GROUP_SIZE - 1;
  if (endPage > totalPages) endPage = totalPages;

  // 페이지 기준 이동 가능 여부
  const hasPrevPage = currentPage > 0;
  const hasNextPage = currentPage < totalPages - 1;

  return (
    <div className="flex justify-center gap-1 mt-6">
      {/* 처음 */}
      <button
        className="px-2 py-1 border rounded disabled:opacity-40"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(0)}
      >
        처음
      </button>

      {/* 이전 */}
      <button
        className="px-2 py-1 border rounded disabled:opacity-40"
        disabled={!hasPrevPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>

      {/* 페이지 번호 */}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber - 1)}
          className={`px-3 py-1 border rounded ${
            pageNumber === currentPageNumber
              ? "bg-blue-500 text-white"
              : ""
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* 다음 */}
      <button
        className="px-2 py-1 border rounded disabled:opacity-40"
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>

      {/* 마지막 */}
      <button
        className="px-2 py-1 border rounded disabled:opacity-40"
        disabled={!hasNextPage}
        onClick={() => onPageChange(totalPages - 1)}
      >
        마지막
      </button>
    </div>
  );
}
