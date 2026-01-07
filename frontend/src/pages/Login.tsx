import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        setMsg("");
        fetch("http://localhost/auth/login", {
            method: "post", 
            headers: {"Content-Type" : "application/json"}, 
            body: JSON.stringify({"username": username, "password": password})
        }).then((res) => {
            if(!res.ok) {
                // 실제 프로그램에서는 이렇게 에러메세지 던지면 안됨.
                if(res.status == 404) {
                    // 에러를 던지고 catch에러를 받는다.
                    throw new Error("존재하지 않는 사용자");
                } else if(res.status == 401) {
                    // 에러를 던지고 catch에러를 받는다.
                    throw new Error("비밀번호가 잘못되었습니다.");
                } else {
                    // 에러를 던지고 catch에러를 받는다.
                    throw new Error("로그인 실패: 알수없는 이유");
                }
            }
            return res.json();
        }).then((data) => {
            // 로그인 성공 정보를 저장 - 로컬저장소(보안이슈), 전역저장소(ex: zustand)
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);
            // navigate("/Me");
            alert("로그인 성공" + localStorage.getItem("username") + localStorage.getItem("token"));
        }).catch((err) => setMsg(err.message));
    };

    return (
        <>
            <h1>로그인</h1>
            <div>
                <input type="text" placeholder="username" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input type="password" placeholder="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleLogin}>로그인</button>
            </div>
            { msg && <div>{msg}</div> }
        </>
    )
}
