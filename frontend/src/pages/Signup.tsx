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
      const res = await fetch("http://localhost/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          role: "USER",
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "회원가입 실패");
      }

      alert(text); // 회원가입 성공 메시지
      navigate("/login");

    } catch (err: any) {
      setMsg(err.message);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">회원가입</h1>

        <input
          type="text"
          className="input"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="input"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={handleSignup}>
          회원가입
        </button>

        {msg && <p className="error-msg">{msg}</p>}
      </div>
    </div>
  );
}
