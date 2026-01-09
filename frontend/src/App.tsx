import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Me from "./pages/Me";
import Dashboard from "./pages/Dashboard";
import AdminUserList from "./pages/AdminUserList";

import { useEffect, useState } from "react";
import CashCalendar from "./pages/CashCalendar";

export default function App() {
    const [role, setRole] = useState<string | null>(
        () => localStorage.getItem("role")
    );

	return (
		<>
			<BrowserRouter>
				<nav className="nav">
                    <Link to="/signup">회원가입</Link>
                    <Link to="/login">로그인</Link>
                    <Link to="/me">개인정보조회</Link>

                    {/* ADMIN 일 때만 링크 보이기 */}
                    {role === "ADMIN" && 
                        <>
                            <Link to="/dashboard">대시보드</Link>
                            <Link to="/admin/users">회원목록</Link>
                        </>
                    }

                    {/* USER 캘린더 */}
                    {role === "USER" && 
                        <>
                            <Link to="/calendar">가계부</Link>
                        </>
                    }

                </nav>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/me" element={<Me />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin/users" element={<AdminUserList />} />
                    <Route path="/calendar" element={<CashCalendar />} />
                </Routes>
			</BrowserRouter>
		</>
	);
}