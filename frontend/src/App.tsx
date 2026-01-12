import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Me from "./pages/Me";
import Dashboard from "./pages/Dashboard";
import AdminUserList from "./pages/AdminUserList";
import CashCalendar from "./pages/CashCalendar";

export default function App() {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [role, setRole] = useState<string | null>(
        localStorage.getItem("role")
    );

    // ✅ 로그아웃은 App 안에서
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        setToken(null);
        setRole(null);
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
                {/* NAV */}
                <nav className="bg-white border-b">
                    <div className="max-w-2xl mx-auto px-4 py-3
                                    flex justify-center gap-6 text-sm font-medium">

                        {!token && (
                            <>
                                <Link to="/signup">회원가입</Link>
                                <Link to="/login">로그인</Link>
                            </>
                        )}

                        {token && (
                            <>
                                <Link to="/me">개인정보조회</Link>
                                
                            </>
                        )}

                        {role === "ADMIN" && (
                            <>
                                <Link to="/dashboard">대시보드</Link>
                                <Link to="/admin/users">회원목록</Link>
                            </>
                        )}

                        {role === "USER" && (
                            <Link to="/calendar">가계부</Link>
                        )}

                        {token && (
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-gray-900"
                                >
                                    로그아웃
                                </button>
                            </>
                        )}
                    </div>
                </nav>

                {/* PAGE */}
                <main className="max-w-2xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <Routes>
                            {/* 비로그인 전용 */}
                            <Route
                                path="/login"
                                element={
                                    token
                                        ? <Navigate to="/" replace />
                                        : <Login
                                            onLogin={() => {
                                                setToken(localStorage.getItem("token"));
                                                setRole(localStorage.getItem("role"));
                                            }}
                                        />
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    token
                                        ? <Navigate to="/" replace />
                                        : <Signup />
                                }
                            />

                            {/* 로그인 필요 */}
                            <Route
                                path="/me"
                                element={
                                    token
                                        ? <Me />
                                        : <Navigate to="/login" replace />
                                }
                            />

                            {/* USER */}
                            <Route
                                path="/calendar"
                                element={
                                    token && role === "USER"
                                        ? <CashCalendar />
                                        : <Navigate to="/login" replace />
                                }
                            />

                            {/* ADMIN */}
                            <Route
                                path="/dashboard"
                                element={
                                    token && role === "ADMIN"
                                        ? <Dashboard />
                                        : <Navigate to="/login" replace />
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    token && role === "ADMIN"
                                        ? <AdminUserList />
                                        : <Navigate to="/login" replace />
                                }
                            />

                            {/* 기본 */}
                            <Route
                                path="/"
                                element={
                                    token
                                        ? (role === "ADMIN"
                                            ? <Dashboard />
                                            : <CashCalendar />)
                                        : <Navigate to="/login" replace />
                                }
                            />

                            {/* fallback */}
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
}
