import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";

type AdminUser = {
  id: number;
  username: string;
  role: string;
  createdAt: string;
};

type PageResponse<T> = {
  content: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
};

export default function AdminUserList() {
  const [data, setData] = useState<PageResponse<AdminUser> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(
      `http://localhost/admin/users?currentPage=${currentPage}&size=5`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("회원 목록 조회 실패");
        return res.json();
      })
      .then(setData)
      .catch((err) => alert(err.message));
  }, [currentPage]);

  if (!data) return <div className="page">로딩중...</div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">회원 목록</h1>

        {/* 회원 테이블 */}
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-slate-100">
              <th>ID</th>
              <th>아이디</th>
              <th>권한</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {data.content.map((user) => (
              <tr key={user.id} className="border-t text-center">
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.createdAt.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이징 */}
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
