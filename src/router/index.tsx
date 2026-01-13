import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../components/Layout/AdminLayout';
import DashboardHome from '../components/DashboardHome';
import Login from '../pages/Login';
import PresensiPublic from '../pages/PresensiPublic';
import Warga from '../pages/admin/Warga';
import Kelas from '../pages/admin/Kelas';
import Jadwal from '../pages/admin/Jadwal';
import Presensi from '../pages/admin/Presensi';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import PublicRoute from '../components/Auth/PublicRoute';

export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
        ],
    },
    {
        path: '/presensi',
        element: <PresensiPublic />,
    },
    {
        path: '/',
        element: <Navigate to="/admin/dashboard" replace />,
    },
    {
        path: '/admin',
        element: <ProtectedRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: 'dashboard',
                        element: <DashboardHome />,
                    },
                    {
                        path: 'warga',
                        element: <Warga />,
                    },
                    {
                        path: 'kelas',
                        element: <Kelas />,
                    },
                    {
                        path: 'jadwal',
                        element: <Jadwal />,
                    },
                    {
                        path: 'presensi',
                        element: <Presensi />,
                    },
                ],
            },
        ],
    },
]);
