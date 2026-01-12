import { useState } from "react";

type Props = {
    onAdded: (date: string) => void;
};

export default function CashAddForm({ onAdded }: Props) {
    const [cashDate, setCashDate] = useState(
        new Date().toISOString().slice(0, 10)
    );
    const [kind, setKind] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [money, setMoney] = useState("");
    const [memo, setMemo] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const [hashtags, setHashtags] = useState("");

    const handleSubmit = async () => {
        if (!money) {
            alert("금액을 입력하세요");
            return;
        }
        if (!token) return;

        setLoading(true);
        try {
            const res = await fetch("/api/cash/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cashDate,
                    kind,
                    money: Number(money),
                    memo,
                    hashtags, 
                }),
            });

            if (!res.ok) throw new Error(await res.text());

            setMoney("");
            setMemo("");
            setKind("EXPENSE");

            onAdded(cashDate);
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded p-4 space-y-2 bg-gray-50">
            <input
                type="date"
                className="input-base"
                value={cashDate}
                onChange={(e) => setCashDate(e.target.value)}
            />

            <select
                className="input-base"
                value={kind}
                onChange={(e) =>
                    setKind(e.target.value as "INCOME" | "EXPENSE")
                }
            >
                <option value="INCOME">수입</option>
                <option value="EXPENSE">지출</option>
            </select>

            <input
                className="input-base"
                type="number"
                placeholder="금액"
                value={money}
                onChange={(e) => setMoney(e.target.value)}
            />

            <input
                className="input-base"
                placeholder="메모"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
            />

            <input
                className="input-base"
                placeholder="#점심 #카페"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
            />

            <button
                className="btn-primary w-full"
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? "저장 중..." : "내역 추가"}
            </button>
        </div>
    );
}
