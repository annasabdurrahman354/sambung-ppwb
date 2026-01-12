import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import ComponentLibrary from './components/ComponentLibrary';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-gray-600 flex overflow-hidden relative isolate">
      {/* BACKGROUND GRADIENTS FOR GLASSMORPHISM */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Top Header - UPDATED with Glassmorphism */}
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
                {activeTab === 'Components' ? 'Design System' : 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Welcome back, Admin.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-white/40 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/60 focus-within:ring-2 focus-within:ring-[#134E35] focus-within:bg-white/60 transition-all w-64 shadow-sm">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Actions */}
            <button className="p-3 bg-white/40 backdrop-blur-sm rounded-full hover:bg-white/60 text-gray-500 border border-white/60 transition-colors relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-white/40 p-1 pr-4 rounded-full transition-all">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm"
              />
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-900">Felix Vance</p>
                <p className="text-xs text-gray-500">Product Manager</p>
              </div>
              <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'Components' ? <ComponentLibrary /> : <DashboardHome />}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-400 pb-4">
            &copy; 2024 Donezo Inc. All rights reserved.
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
