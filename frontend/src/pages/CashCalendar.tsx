import { useEffect, useState } from "react";
import CashCalendarGrid from "../components/CashCalendarGrid";
import CashDailyList from "../components/CashDailyList";
import type { CashCalendarItem } from "../types/CashCalendarItem";

export default function CashCalendar() {
    const [data, setData] = useState<CashCalendarItem[]>([]);
    const [month, setMonth] = useState("2026-01");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const moveMonth = (diff: number) => {
        const [y, m] = month.split("-").map(Number);
        const d = new Date(y, m - 1 + diff, 1);

        setMonth(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        );
        setSelectedDate(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost/api/cash/calendar?month=${month}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error("캘린더 조회 실패");
                return res.json();
            })
            .then(setData)
            .catch(() => setData([]));
    }, [month]);

    return (
        <div className="page">
            <div className="container">
                <h1 className="page-title">가계부</h1>

                <div className="flex gap-2 mb-4 items-center">
                    <button onClick={() => moveMonth(-1)}>◀</button>
                    <span className="font-semibold">{month}</span>
                    <button onClick={() => moveMonth(1)}>▶</button>
                </div>

                <CashCalendarGrid
                    data={data}
                    month={month}
                    onSelectDate={setSelectedDate}
                />

                {selectedDate && (
                    <div className="mt-6">
                        <h2 className="section-title">
                            {selectedDate} 내역
                        </h2>
                        <CashDailyList date={selectedDate} />
                    </div>
                )}
            </div>
        </div>
    );
}
