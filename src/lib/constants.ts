import {
    LayoutDashboard,
    Users,
    CreditCard,
    Box,
    Layers,
    type LucideIcon
} from 'lucide-react';

export const COLORS = {
    primary: '#134E35',      // Deep Emerald Green
    secondary: '#4E7C63',    // Sage Green
    accent: '#A3B18A',       // Light Sage
    background: '#F0F2F5',   // App BG
    card: '#FFFFFF',         // Card BG
    textMain: '#111827',     // Headings
    textBody: '#6B7280',     // Body
    border: '#E5E7EB',       // Subtle border
} as const;

export const REVENUE_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4200 },
];

export const DEMOGRAPHICS_DATA = [
    { name: 'Enterprise', value: 400 },
    { name: 'Small Biz', value: 300 },
    { name: 'Freelance', value: 300 },
];

export const PIE_COLORS: string[] = [COLORS.primary, COLORS.secondary, '#DAD7CD'];

export interface Transaction {
    id: number;
    user: string;
    company: string;
    amount: string;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
}

export const TRANSACTIONS: Transaction[] = [
    { id: 1, user: 'Alex Morgan', company: 'TechFlow', amount: '$1,200.00', status: 'Completed', date: 'Oct 24, 2023' },
    { id: 2, user: 'Sarah Chen', company: 'DesignCo', amount: '$850.00', status: 'Pending', date: 'Oct 23, 2023' },
    { id: 3, user: 'James Wilson', company: 'BuildIt', amount: '$2,300.00', status: 'Completed', date: 'Oct 22, 2023' },
    { id: 4, user: 'Maria Garcia', company: 'GlobalInc', amount: '$600.00', status: 'Failed', date: 'Oct 21, 2023' },
];

export interface SidebarItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Warga', path: '/admin/warga', icon: Users },
    { name: 'Kelas', path: '/admin/kelas', icon: Layers }, // Using Layers icon for Kelas temporarily
    { name: 'Jadwal', path: '/admin/jadwal', icon: CreditCard }, // Using CreditCard icon for Jadwal temporarily
    { name: 'Presensi', path: '/admin/presensi', icon: Box }, // Using Box icon for Presensi temporarily
];
