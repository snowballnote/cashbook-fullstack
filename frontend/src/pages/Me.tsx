import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Me() {
    const [moreInfo, setMoreInfo] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    // 로그인 사용자 정보 조회
    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("/api/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
        .then((res) => {
            if (!res.ok) throw new Error("인증실패 " + res.status);
            return res.text();
        })
        .then((data) => setMoreInfo(data))
        .catch((err) => {
            alert(err.message);
            navigate("/login");
        });
    }, []);

    // 비밀번호 변경
    const handleChangePassword = async () => {
        const token = localStorage.getItem("token");
        setMsg("");

        if (!currentPassword || !newPassword) {
            setMsg("비밀번호를 입력해주세요.");
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
                "Authorization": "Bearer " + token,
            },
                body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });

        const text = await res.text();

        if (!res.ok) throw new Error(text);

        alert(text); // 비밀번호 변경 성공

        // 비밀번호 변경 후 로그아웃
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
        } catch (err: any) {
            setMsg(err.message);
        }
    };

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // 회원탈퇴
    const handleWithdraw = async () => {
        const token = localStorage.getItem("token");
        const confirmWithdraw = window.confirm(
            "탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?"
        );

        if (!confirmWithdraw) return;

        try {
            const res = await fetch("/api/users/me", {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                },
            });

            if (!res.ok) {
            if (res.status === 401) {
                alert("로그인이 만료되었습니다.");
            } else {
                alert("회원탈퇴에 실패했습니다.");
            }
            return;
            }

            // ✅ 탈퇴 성공
            localStorage.removeItem("token");
            alert("회원탈퇴가 완료되었습니다.");
            window.location.href = "/login";

        } catch (err) {
            console.error(err);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div className="page">
                <div className="container max-w-md mx-auto">
                <h1 className="page-title mb-6">내 정보</h1>

                {/* 내 정보 */}
                <div className="mb-8">
                    <p className="text-sm text-gray-700">
                    <span className="font-medium">
                        {localStorage.getItem("username")}
                    </span>
                    님 반갑습니다.
                    </p>
                    {moreInfo && (
                    <p className="text-xs text-gray-400 mt-1">{moreInfo}</p>
                    )}
                </div>

                <button
                    className="button-secondary w-full mb-8"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>

                <hr className="mb-8" />

                {/* 보안 설정 */}
                <h2 className="section-title mb-4">보안 설정</h2>

                <div className="space-y-3">
                    <input
                    type="password"
                    className="input"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    />

                    <input
                    type="password"
                    className="input"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <input
                    type="password"
                    className="input"
                    placeholder="새 비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <button
                    className="button w-full mt-2"
                    onClick={handleChangePassword}
                    >
                    비밀번호 변경
                    </button>

                    {msg && (
                    <p className="error-msg text-sm mt-2 text-center">
                        {msg}
                    </p>
                    )}
                </div>

                <hr className="my-10 border-red-200" />

                {/* 위험 영역 */}
                <div className="bg-red-50 border border-red-200 rounded p-4">
                    <h2 className="text-red-600 font-semibold mb-2">
                    위험 영역
                    </h2>
                    <p className="text-xs text-red-500 mb-4 leading-relaxed">
                    회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                    <br />
                    신중하게 결정해주세요.
                    </p>

                    <button
                    className="w-full px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                    onClick={handleWithdraw}
                    >
                    회원탈퇴
                    </button>
                </div>
                </div>
            </div>
            );
        </>
    );
}
