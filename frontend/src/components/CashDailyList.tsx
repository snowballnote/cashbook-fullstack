import { useEffect, useState } from "react";

type CashItem = {
    cashId: number;
    kind: "INCOME" | "EXPENSE";
    money: number;
    memo: string;
};

type Props = {
    date: string;
};

export default function CashDailyList({ date }: Props) {
    const [list, setList] = useState<CashItem[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost/api/cash/daily?date=${date}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("상세 조회 실패");
                }
                return res.json();
            })
            .then(data => {
                console.log("📌 일별 상세 응답", data);
                setList(data);
            })
            .catch(err => {
                console.error("❌ 일별 조회 실패", err);
                setList([]);
            });
    }, [date]);

    if (list.length === 0) {
        return (
            <div className="text-sm text-gray-400">
                해당 날짜 내역이 없습니다.
            </div>
        );
    }

    return (
        <ul className="cash-list">
            {list.map(item => (
                <li key={item.cashId} className="cash-item">
                    <div>
                        <div className="cash-memo">
                            [{item.kind === "INCOME" ? "수입" : "지출"}] {item.memo}
                        </div>
                    </div>

                    <div
                        className={
                            item.kind === "INCOME"
                                ? "amount-income"
                                : "amount-expense"
                        }
                    >
                        {item.kind === "INCOME" ? "+" : "-"}
                        {item.money.toLocaleString()}
                    </div>
                </li>
            ))}
        </ul>
    );
}
