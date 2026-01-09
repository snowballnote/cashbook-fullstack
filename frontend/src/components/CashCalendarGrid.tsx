import type { CashCalendarItem } from "../types/CashCalendarItem";
import React from "react";

type Props = {
    data: CashCalendarItem[];
    month: string;
    onSelectDate: (date: string) => void;
};

export default function CashCalendarGrid({
    data,
    month,
    onSelectDate,
}: Props) {
    const [year, m] = month.split("-").map(Number);

    const firstDay = new Date(year, m - 1, 1).getDay();
    const lastDate = new Date(year, m, 0).getDate();

    const map = new Map(
        data.map(item => [item.cashDate, item])
    );

    const cells: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= lastDate; day++) {
        const date = `${month}-${String(day).padStart(2, "0")}`;
        const item = map.get(date);

        cells.push(
            <div
                key={date}
                onClick={() => onSelectDate(date)}
                className="border rounded p-2 h-24 text-sm cursor-pointer hover:bg-slate-100"
            >
                <div className="font-semibold">{day}</div>

                {item && (
                    <div className="mt-1 text-xs">
                        {item.incomeTotal > 0 && (
                            <div className="amount-income">
                                + {item.incomeTotal.toLocaleString()}
                            </div>
                        )}
                        {item.expenseTotal > 0 && (
                            <div className="amount-expense">
                                - {item.expenseTotal.toLocaleString()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-7 text-center font-bold mb-2">
                {["일", "월", "화", "수", "목", "금", "토"].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {cells}
            </div>
        </>
    );
}
