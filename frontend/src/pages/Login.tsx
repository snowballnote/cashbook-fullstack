import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }: { onLogin: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        setMsg("");

        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.trim(),
                password: password,
            }),
        })
        .then((res) => {
            if (!res.ok) {
            if (res.status === 404) throw new Error("존재하지 않는 사용자");
            if (res.status === 401) throw new Error("비밀번호가 잘못되었습니다.");
            throw new Error("로그인 실패");
            }
            return res.json();
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            onLogin();               // ✅ App 리렌더 트리거
            navigate("/calendar", { replace: true });
        })

        .catch((err) => setMsg(err.message));
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-sm">

                <h1 className="text-xl font-semibold text-center mb-2">
                    로그인
                </h1>

                <p className="text-sm text-gray-500 text-center mb-6">
                    가계부 서비스를 이용하려면 로그인하세요
                </p>

                <div className="space-y-3">
                    <input
                        className="input-base"
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <input
                        className="input-base"
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="btn-primary w-full mt-2"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                </div>

                {msg && (
                    <p className="text-sm text-red-500 text-center mt-4">
                        {msg}
                    </p>
                )}

            </div>
        </div>
    );
}
