import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Me() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    // 로그인 사용자 정보 조회 (인증 체크)
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/users/me", {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then((res) => {
            if (!res.ok) throw new Error();
        })
        .catch(() => {
            navigate("/login");
        });
    }, [navigate]);

    // 비밀번호 변경 처리
    const handleChangePassword = async () => {
        const token = localStorage.getItem("token");
        setMsg("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMsg("모든 비밀번호를 입력해주세요.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMsg("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await fetch("/api/users/me/password", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const text = await res.text();
            if (!res.ok) throw new Error(text);

            alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
            localStorage.clear();
            navigate("/login");
        } catch (err: any) {
            setMsg(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleWithdraw = async () => {
        const token = localStorage.getItem("token");
        if (!window.confirm("모든 데이터가 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?")) {
            return;
        }

        const res = await fetch("/api/users/me", {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
        });

        if (res.ok) {
            alert("회원탈퇴가 완료되었습니다.");
            localStorage.clear();
            navigate("/login");
        } else {
            alert("회원탈퇴에 실패했습니다.");
        }
    };

    return (
        <div className="space-y-10">

            <h1 className="text-xl font-semibold">계정 설정</h1>

            {/* 내 정보 */}
            <div className="flex gap-6">
                <div className="w-40 shrink-0">
                    <h2 className="font-medium">내 정보</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        로그인 계정 정보
                    </p>
                </div>

                <div className="flex-1 max-w-md bg-white rounded-lg p-5 shadow-sm">
                    <p className="text-sm mb-4">
                        <span className="font-medium">{username}</span> 님으로 로그인되어 있습니다.
                    </p>
                    <button
                        className="px-3 py-1.5 rounded-md text-sm text-gray-700
                                border border-gray-300 hover:bg-gray-100 transition"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </div>
            </div>

            {/* 비밀번호 변경 */}
            <div className="flex gap-6">
                <div className="w-40 shrink-0">
                    <h2 className="font-medium">보안</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        비밀번호 변경
                    </p>
                </div>

                <div className="flex-1 max-w-md bg-white rounded-lg p-5 shadow-sm">
                    <input
                        className="input-base"
                        type="password"
                        placeholder="현재 비밀번호"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <input
                        className="input-base"
                        type="password"
                        placeholder="새 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                        className="input-base"
                        type="password"
                        placeholder="새 비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                        className="btn-primary w-full mt-2"
                        onClick={handleChangePassword}
                    >
                        비밀번호 변경
                    </button>
                    {msg && (
                        <p className="text-sm text-red-500 text-center">
                            {msg}
                        </p>
                    )}
                </div>
            </div>

            {/* 회원탈퇴 */}
            <div className="flex gap-6">
                <div className="w-40 shrink-0">
                    <h2 className="font-medium text-red-600">위험</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        계정 삭제
                    </p>
                </div>

                <div className="flex-1 max-w-md bg-white rounded-lg p-5 shadow-sm">
                    <p className="text-sm text-red-600 mb-4">
                        회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    </p>
                    <button
                        className="px-4 py-2 rounded-md text-sm font-medium
                                bg-red-600 text-white hover:bg-red-700 transition"
                        onClick={handleWithdraw}
                    >
                        회원탈퇴
                    </button>
                </div>
            </div>

        </div>
    );
}