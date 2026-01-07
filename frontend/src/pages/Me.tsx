import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Me() {
    const [moreInfo, setMoreInfo] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(token);

        fetch("http://localhost/api/me", {
            method: "get", 
            headers: {
                "Content-Type":"application/json", 
                "Autorization":"Bearer " + token
            }
        }).then((res) => {
            if(!res.ok) throw new Error("인증실패" + res.status);
            return res.text();
        }).then((data) => setMoreInfo(data)
        ).catch((err) => {
            alert(err.message);
            navigate("/Login");
    })}, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/Login");
    }

    return (
        <>
            <h1>Me</h1>
            <div>
                <div>{localStorage.getItem("username")}님 반갑습니다.</div>
                { moreInfo && <div>{moreInfo}</div> }
                <button onClick={handleLogout}>로그아웃</button>
            </div>
        </>
    );
}
