import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Singup from "./pages/Singup";
import Login from "./pages/Login";
import Me from "./pages/Me";

export default function App() {

    return (
        <>
            <BrowserRouter>
                <ul>
                    <li><Link to="/">회원가입</Link></li>
                    <li><Link to="/Login">로그인</Link></li>
                    <li><Link to="/Me">인증 테스트(/api/me)</Link></li>
                </ul>
                <Routes>
                    <Route path="/" element={<Singup />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Me" element={<Me />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
