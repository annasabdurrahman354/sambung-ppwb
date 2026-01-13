
import {
    CreditCard,
    Users,
    TrendingUp,
    Box,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell
} from 'recharts';
import Card from './ui/Card';
import Badge from './ui/Badge';
import {
    REVENUE_DATA,
    DEMOGRAPHICS_DATA,
    PIE_COLORS,
    TRANSACTIONS,
    COLORS
} from '../lib/constants';

const DashboardHome = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', val: '$45,231.89', change: '+20.1%', isPos: true, icon: CreditCard },
                    { label: 'Active Users', val: '2,350', change: '+15.2%', isPos: true, icon: Users },
                    { label: 'Bounce Rate', val: '42.3%', change: '-5.4%', isPos: false, icon: TrendingUp },
                    { label: 'Open Projects', val: '12', change: '+2', isPos: true, icon: Box },
                ].map((stat, i) => (
                    <Card key={i} className="flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-full ${i === 0 ? 'bg-emerald-100/50 text-[#134E35]' : 'bg-gray-100/50 text-gray-600'} backdrop-blur-sm`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${stat.isPos ? 'bg-green-50/50 text-green-700' : 'bg-red-50/50 text-red-700'}`}>
                                {stat.isPos ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#111827] mb-1">{stat.val}</h3>
                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 2. Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar Chart */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-[#111827]">Revenue Statistics</h3>
                            <p className="text-sm text-gray-500">Monthly breakdown of current year</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-50/50 backdrop-blur-sm hover:bg-gray-100/50 rounded-full text-sm font-medium text-gray-600 flex items-center gap-2">
                            <Calendar size={16} />
                            2023
                            <ChevronDown size={14} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(249, 250, 251, 0.5)' }}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#fff'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={COLORS.primary}
                                    barSize={32}
                                    radius={[6, 6, 6, 6]}
                                    activeBar={{ fill: COLORS.secondary }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Donut Chart */}
                <Card>
                    <h3 className="text-lg font-bold text-[#111827] mb-1">User Demographics</h3>
                    <p className="text-sm text-gray-500 mb-8">By company size</p>
                    <div className="h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={DEMOGRAPHICS_DATA}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {DEMOGRAPHICS_DATA.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-[#111827]">1k</span>
                            <span className="text-xs text-gray-500">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {DEMOGRAPHICS_DATA.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                                    <span className="text-sm font-medium text-gray-600">{entry.name}</span>
                                </div>
                                <span className="text-sm font-bold text-[#111827]">{((entry.value / 1000) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. Recent Orders Table */}
            <Card noPadding className="overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-100/50">
                    <div>
                        <h3 className="text-lg font-bold text-[#111827]">Recent Transactions</h3>
                        <p className="text-sm text-gray-500">Latest financial activity</p>
                    </div>
                    <button className="text-sm font-semibold text-[#134E35] hover:text-[#0c3323] transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50/50 backdrop-blur-sm text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {TRANSACTIONS.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200/50 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-gray-600">
                                                {t.user.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900">{t.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{t.company}</td>
                                    <td className="px-6 py-4">{t.date}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{t.amount}</td>
                                    <td className="px-6 py-4">
                                        <Badge status={t.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 4. Projects Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#111827]">Active Projects</h3>
                    <button className="w-10 h-10 rounded-full bg-[#134E35] text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 hover:bg-[#0c3323] transition-colors">
                        +
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <Card key={item} className="group hover:border-[#134E35]/30 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-gray-50/50 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-emerald-50/50 transition-colors">
                                    <Box size={24} className="text-gray-400 group-hover:text-[#134E35]" />
                                </div>
                                <span className="bg-gray-100/50 backdrop-blur-sm text-gray-600 text-xs px-2 py-1 rounded-md font-medium">
                                    3 days left
                                </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-2">Website Redesign</h4>
                            <p className="text-sm text-gray-500 mb-6">Revamping the corporate website with new branding guidelines.</p>

                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                                    ))}
                                </div>
                                <div className="text-sm font-semibold text-[#134E35]">75%</div>
                            </div>
                            <div className="w-full bg-gray-100/50 h-2 rounded-full mt-2 overflow-hidden">
                                <div className="bg-[#134E35] h-full rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
