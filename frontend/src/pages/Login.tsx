import { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
//   const navigate = useNavigate();

  const handleLogin = () => {
    setMsg("");

    fetch("http://localhost:80/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
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

        window.location.reload();
      })
      .catch((err) => setMsg(err.message));
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">로그인</h1>

        <input
          className="input"
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={handleLogin}>
          로그인
        </button>

        {msg && <div className="error-msg">{msg}</div>}
      </div>
    </div>
  );
}
