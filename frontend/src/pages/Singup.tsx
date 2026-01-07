import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Singup() {
    // useState훅 -> useRef 훅으로 변경 //**과제
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Link를 코드로 구현한는 API

    const handleSignup = () => {
        console.log(username, password);
        fetch("http://localhost/auth/signup", {
                method: "post", 
                headers: {"Content-Type" : "application/json"}, 
                body: JSON.stringify({username, password, "role":"USER"})
            }).then((res) => 
                res.text()
                // 회원가입 실패 -> catch((err) => console.log(err.message))
            ).then((data) => {
                alert(data);
                navigate("/Login");
            });
    };
    return (
        <>
            <h1>회원가입</h1>
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
                <button onClick={handleSignup}>회원가입</button>
            </div>
        </>
    )
}
