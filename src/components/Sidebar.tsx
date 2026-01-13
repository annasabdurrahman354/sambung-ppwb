import { TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { SIDEBAR_ITEMS } from '../lib/constants';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    isCollapsed: boolean;
    setIsCollapsed: (isCollapsed: boolean) => void;
    activeTab: string; // Deprecated
    setActiveTab: (tab: string) => void; // Deprecated
}
const Sidebar = ({ isOpen, /* setIsOpen, */ isCollapsed, setIsCollapsed }: SidebarProps) => {
    const navigate = useNavigate();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out",
                "bg-white/70 backdrop-blur-2xl border-r border-white/40 shadow-2xl shadow-emerald-900/5",
                isOpen ? 'translate-x-0' : '-translate-x-full',
                "lg:relative lg:translate-x-0 lg:block",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            <div className="h-full flex flex-col p-4 overflow-y-auto scrollbar-hide relative">
                {/* Logo - Clickable for Collapse */}
                <div
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "flex items-center gap-3 mb-10 px-2 shrink-0 cursor-pointer group select-none",
                        isCollapsed && "justify-center px-0"
                    )}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <div className="w-10 h-10 bg-[#134E35] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
                        S
                    </div>
                    {!isCollapsed && <span className="text-xl font-bold tracking-tight text-gray-900 animate-in fade-in duration-300">Sambung PPWB.</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? 'bg-[#134E35] text-white shadow-lg shadow-emerald-900/20'
                                    : 'text-gray-500 hover:bg-white/40 hover:text-gray-900',
                                isCollapsed && "justify-center px-0"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon size={20} className="shrink-0" />
                            {!isCollapsed && <span className="animate-in fade-in duration-300">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Promotion Card */}
                {!isCollapsed && (
                    <div className="mt-auto pt-6 shrink-0 animate-in fade-in duration-500">
                        <div className="rounded-[24px] p-6 bg-gradient-to-br from-gray-900 to-[#134E35] text-white relative overflow-hidden group cursor-pointer shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={80} />
                            </div>

                            <div className="relative z-10">
                                <button
                                    onClick={() => navigate('/presensi')}
                                    className="w-full py-2.5 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Halaman Presensi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
