import { useEffect, useState } from "react";
import CashCalendarGrid from "../components/CashCalendarGrid";
import CashDailyList from "../components/CashDailyList";
import CashAddForm from "../components/CashAddForm";
import type { CashCalendarItem } from "../types/CashCalendarItem";

export default function CashCalendar() {
    const [data, setData] = useState<CashCalendarItem[]>([]);
    const [month, setMonth] = useState("2026-01");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    /* ===============================
       월 이동
    =============================== */
    const moveMonth = (diff: number) => {
        const [y, m] = month.split("-").map(Number);
        const d = new Date(y, m - 1 + diff, 1);

        setMonth(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        );
        setSelectedDate(null);
    };

    /* ===============================
       캘린더 조회
    =============================== */
    const fetchCalendar = () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`/api/cash/calendar?month=${month}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("캘린더 조회 실패");
                return res.json();
            })
            .then(setData)
            .catch(() => setData([]));
    };

    // 월 변경 시 자동 조회
    useEffect(() => {
        fetchCalendar();
    }, [month]);

    return (
        <div className="page">
            <div className="container">
                <h1 className="page-title">가계부</h1>

                {/* ===============================
                    ➕ 내역 추가 (날짜 직접 선택)
                =============================== */}
                <div className="mb-6">
                    <CashAddForm
                        onAdded={(date) => {
                            fetchCalendar();      // 월 캘린더 즉시 반영
                            setSelectedDate(date); // 해당 날짜 자동 선택
                        }}
                    />
                </div>

                {/* ===============================
                    월 이동
                =============================== */}
                <div className="flex gap-2 mb-4 items-center">
                    <button onClick={() => moveMonth(-1)}>◀</button>
                    <span className="font-semibold">{month}</span>
                    <button onClick={() => moveMonth(1)}>▶</button>
                </div>

                {/* ===============================
                    캘린더
                =============================== */}
                <CashCalendarGrid
                    data={data}
                    month={month}
                    onSelectDate={setSelectedDate}
                />

                {/* ===============================
                    일별 내역
                =============================== */}
                {selectedDate && (
                    <div className="mt-6">
                        <h2 className="section-title">
                            {selectedDate} 내역
                        </h2>
                        <CashDailyList
                            key={selectedDate} 
                            date={selectedDate}
                            onChanged={(newDate?: string) => {
                                if (newDate) {
                                    const newMonth = newDate.slice(0, 7);

                                    if (newMonth === month) {
                                        // ⭐ 같은 달 → 직접 재조회
                                        fetchCalendar();
                                    } else {
                                        // ⭐ 다른 달 → month 변경 → useEffect가 처리
                                        setMonth(newMonth);
                                    }

                                    setSelectedDate(newDate);
                                } else {
                                    // 날짜 안 바뀐 단순 수정
                                    fetchCalendar();
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
