import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const handleSignup = async () => {
        setMsg("");

        if (!username || !password) {
            setMsg("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    role: "USER",
                }),
            });

            const text = await res.text();
            if (!res.ok) throw new Error(text || "회원가입 실패");

            alert(text);
            navigate("/login");
        } catch (err: any) {
            setMsg(err.message);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-sm">

                <h1 className="text-xl font-semibold text-center mb-2">
                    회원가입
                </h1>

                <p className="text-sm text-gray-500 text-center mb-6">
                    가계부 서비스 회원가입
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
                        onClick={handleSignup}
                    >
                        회원가입
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
