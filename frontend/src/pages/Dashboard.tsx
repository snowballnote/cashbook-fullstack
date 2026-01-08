import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSignupChart from "../components/UserSignupChart";

type DayCount = {
  date: string;
  count: number;
};

type UsersSummaryResponse = {
  totalUsers: number;
  todayUsers: number;
  yesterdayUsers: number;
  thisMonthUsers: number;
  last7Days: DayCount[];
};

export default function Dashboard() {
  const [data, setData] = useState<UsersSummaryResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // ADMIN 아니면 접근 차단 (UX용)
    if (role !== "ADMIN") {
      alert("관리자만 접근 가능합니다.");
      navigate("/me");
      return;
    }

    fetch("http://localhost/charts/users/summary", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("대시보드 조회 실패");
        return res.json();
      })
      .then(setData)
      .catch((err) => alert(err.message));
  }, []);

  if (!data) {
    return <div className="page">로딩중...</div>;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">대시보드</h1>

        {/* 숫자 요약 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-100 rounded">
            전체 회원 수<br />
            <b>{data.totalUsers}</b>
          </div>
          <div className="p-4 bg-slate-100 rounded">
            오늘 가입자<br />
            <b>{data.todayUsers}</b>
          </div>
          <div className="p-4 bg-slate-100 rounded">
            어제 가입자<br />
            <b>{data.yesterdayUsers}</b>
          </div>
          <div className="p-4 bg-slate-100 rounded">
            이번달 가입자<br />
            <b>{data.thisMonthUsers}</b>
          </div>
        </div>

        {/* 최근 7일 목록 */}
        {data.last7Days && (
        <div className="mt-6">
            <h2 className="section-title">최근 7일 가입자</h2>

            <UserSignupChart data={data.last7Days} />
        </div>
        )}
      </div>
    </div>
  );
}
