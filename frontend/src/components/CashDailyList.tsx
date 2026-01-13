import { useEffect, useState } from "react";
import type { CashDailyItem } from "../types/CashCalendarItem";

type Props = {
    date: string;
    onChanged: (newDate?: string) => void; // 월 캘린더 재조회
};

export default function CashDailyList({ date, onChanged }: Props) {
    const [list, setList] = useState<CashDailyItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        cashDate: date, 
        kind: "EXPENSE" as "INCOME" | "EXPENSE",
        money: "",
        memo: "",
        hashtags: "",
    });
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const token = localStorage.getItem("token");

    /* ===============================
       일별 조회 함수 (재사용)
    =============================== */
    const fetchDaily = () => {
        if (!token) return;

        fetch(`/api/cash/daily?cashDate=${date}`, {
            headers: { Authorization: "Bearer " + token },
        })
            .then((res) => {
                if (!res.ok) throw new Error("일별 조회 실패");
                return res.json();
            })
            .then(setList)
            .catch(() => setList([]));
    };
    console.log("TOKEN =", token);

    useEffect(() => {
        fetchDaily();
    }, [date]);

    /* ===============================
       수정 시작
    =============================== */
    const startEdit = (item: CashDailyItem) => {
        setEditingId(item.cashId);
        setEditForm({
            cashDate: item.cashDate, 
            kind: item.kind,
            money: String(item.money),
            memo: item.memo ?? "",
            hashtags: item.hashtags
                ? item.hashtags.map(tag => `#${tag}`).join(" ")
                : "",
        });
    };

    /* ===============================
       수정 저장
    =============================== */
    const handleUpdate = async (cashId: number) => {
        if (!token) return;

        setLoadingId(cashId);
        try {
            const res = await fetch(`/api/cash/${cashId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cashDate: editForm.cashDate, 
                    kind: editForm.kind,
                    money: Number(editForm.money),
                    memo: editForm.memo,
                    hashtags: editForm.hashtags,
                }),
            });

            if (!res.ok) throw new Error(await res.text());

            // 일별 즉시 반영
            if (editForm.cashDate !== date) {
                // 날짜 이동 → 현재 리스트에서 제거
                setList((prev) => prev.filter((i) => i.cashId !== cashId));
            } else {
                // 같은 날짜 → 값만 갱신
                setList((prev) =>
                    prev.map((item) =>
                        item.cashId === cashId
                            ? {
                                ...item,
                                kind: editForm.kind,
                                money: Number(editForm.money),
                                memo: editForm.memo,
                            }
                            : item
                    )
                );
            }

            setEditingId(null);
            onChanged(editForm.cashDate); // 월 캘린더 재조회
            console.log("PATCH payload", {
    cashDate: editForm.cashDate,
    kind: editForm.kind,
    money: Number(editForm.money),
    memo: editForm.memo,
});

        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    /* ===============================
       삭제
    =============================== */
    const handleDelete = async (cashId: number) => {
        if (!token) return;
        if (!confirm("삭제하시겠습니까?")) return;

        setLoadingId(cashId);
        try {
            const res = await fetch(`/api/cash/${cashId}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + token },
            });

            if (!res.ok) throw new Error(await res.text());

            // 일별 즉시 반영
            setList((prev) => prev.filter((i) => i.cashId !== cashId));
            onChanged(); // ⭐ 월 캘린더 갱신
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* ===============================
                일별 리스트
            =============================== */}
            {list.length === 0 ? (
                <div className="text-sm text-gray-400 py-4">
                    해당 날짜 내역이 없습니다.
                </div>
            ) : (
                <div className="space-y-2">
                    {list.map((item) => (
                        <div
                            key={item.cashId}
                            className="flex justify-between items-start border-b py-2 last:border-0"
                        >
                            <div className="flex-1">
                                {editingId === item.cashId ? (
                                    <div className="space-y-2">
                                        <select
                                            className="input-base"
                                            value={editForm.kind}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    kind: e.target.value as any,
                                                })
                                            }
                                        >
                                            <option value="INCOME">수입</option>
                                            <option value="EXPENSE">지출</option>
                                        </select>
                                        
                                        <input
                                            type="date"
                                            className="input-base"
                                            value={editForm.cashDate}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    cashDate: e.target.value,
                                                })
                                            }
                                        />

                                        <input
                                            className="input-base"
                                            type="number"
                                            placeholder="금액"
                                            value={editForm.money}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    money: e.target.value,
                                                })
                                            }
                                        />

                                        <input
                                            className="input-base"
                                            placeholder="메모"
                                            value={editForm.memo}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    memo: e.target.value,
                                                })
                                            }
                                        />
                                        <input
                                            className="input-base"
                                            placeholder="#점심 #카페"
                                            value={editForm.hashtags}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    hashtags: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm">
                                            [{item.kind === "INCOME" ? "수입" : "지출"}]{" "}
                                            {item.memo || "메모 없음"}
                                        </p>
                                        {item.hashtags && item.hashtags.length > 0 && (
                                            <div className="flex gap-2 mt-1 text-xs text-gray-500">
                                                {item.hashtags.map((tag) => (
                                                    <span key={tag}>#{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* 오른쪽 */}
                            <div className="flex items-center gap-3 ml-4">
                                <span
                                    className={
                                        item.kind === "INCOME"
                                            ? "text-blue-600 font-medium"
                                            : "text-red-500 font-medium"
                                    }
                                >
                                    {item.kind === "INCOME" ? "+" : "-"}
                                    {item.money.toLocaleString()}
                                </span>

                                {editingId === item.cashId ? (
                                    <>
                                        <button
                                            className="text-sm text-blue-600"
                                            disabled={loadingId === item.cashId}
                                            onClick={() =>
                                                handleUpdate(item.cashId)
                                            }
                                        >
                                            저장
                                        </button>
                                        <button
                                            className="text-sm text-gray-500"
                                            onClick={() => setEditingId(null)}
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="text-sm text-gray-600"
                                            onClick={() => startEdit(item)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="text-sm text-red-600"
                                            disabled={loadingId === item.cashId}
                                            onClick={() =>
                                                handleDelete(item.cashId)
                                            }
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
