import { useState } from 'react';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Get display name or email
    const displayName = user?.user_metadata?.full_name || user?.email || 'Admin';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans text-gray-600 flex overflow-hidden relative isolate">
            {/* BACKGROUND GRADIENTS */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-300/20 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] bg-blue-300/20 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-200/20 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Top Header */}
                <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm flex-shrink-0 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-white/40 rounded-full transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="hidden md:flex flex-col">
                            <h1 className="text-2xl font-bold text-[#111827]">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">Welcome,</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-white/60 p-1 pr-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#134E35]/20"
                            >
                                <img
                                    src={avatarUrl}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm"
                                />
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{displayName}</p>
                                    <p className="text-xs text-gray-500">Admin</p>
                                </div>
                                <ChevronDown size={16} className={`text-gray-400 hidden lg:block transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-white/50 py-1 z-40 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                            <p className="text-xs text-gray-500">Admin</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content (Outlet) */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>

                    <div className="mt-12 text-center text-sm text-gray-400 pb-4">
                        &copy; Pondok Wali Barokah.
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
