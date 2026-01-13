import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../../api/supabase';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Table, { Column } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import type { Presensi, Warga, Jadwal, Kelas } from '../../types';

// Extended type for the joined data we fetch
interface PresensiWithRelations extends Presensi {
    warga?: Pick<Warga, 'nama' | 'rfid'>;
    kelas?: Pick<Kelas, 'nama'>; // Relationship from presensi.kelas_id
}

const SESI_OPTIONS = [
    { label: 'Fajar', value: 'fajar' },
    { label: 'Pagi 1', value: 'pagi_1' },
    { label: 'Pagi 2', value: 'pagi_2' },
    { label: 'Siang', value: 'siang' },
    { label: 'Sore', value: 'sore' },
    { label: 'Maghrib', value: 'maghrib' },
    { label: 'Malam', value: 'malam' },
];

const Presensi = () => {
    const [presensiList, setPresensiList] = useState<PresensiWithRelations[]>([]);
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterKelas, setFilterKelas] = useState<string>('all'); // 'all', 'null' (umum), or specific ID
    const [filterSesi, setFilterSesi] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchKelas();
    }, []);

    useEffect(() => {
        fetchPresensi();
    }, [filterDate, filterKelas, filterSesi]);

    const fetchKelas = async () => {
        const { data, error } = await supabase.from('kelas').select('*').order('nama');
        if (error) console.error("Error fetching kelas:", error);
        else setKelasList(data || []);
    };

    const fetchPresensi = async () => {
        setLoading(true);
        // Build base query
        let query = supabase
            .from('presensi')
            .select(`
                *,
                warga (nama, rfid),
                kelas (nama)
            `)
            .gte('created_at', `${filterDate}T00:00:00`)
            .lte('created_at', `${filterDate}T23:59:59`);

        // Apply kelas filter
        if (filterKelas === 'null') {
            query = query.is('kelas_id', null);
        } else if (filterKelas !== 'all') {
            query = query.eq('kelas_id', filterKelas);
        }

        // Apply sesi filter
        if (filterSesi !== 'all') {
            query = query.eq('sesi', filterSesi);
        }

        // Execute query details
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) console.error(error);
        else setPresensiList(data || []);

        setLoading(false);
    };

    const columns: Column<PresensiWithRelations>[] = [
        {
            header: 'Warga',
            accessor: 'warga',
            className: 'font-medium text-gray-900',
            render: (row) => (
                <div>
                    <div className="font-bold">{row.warga?.nama}</div>
                    <div className="text-xs text-gray-500 font-mono">{row.warga?.rfid}</div>
                </div>
            )
        },
        {
            header: 'Sesi',
            accessor: 'sesi',
            className: 'text-gray-500',
            render: (row) => <span className="capitalize">{row.sesi ? row.sesi.replace('_', ' ') : '-'}</span>
        },
        {
            header: 'Kelas',
            accessor: 'kelas',
            className: 'text-gray-500',
            render: (row) => row.kelas?.nama ? <Badge status={row.kelas.nama} variant="info" /> : <span className="text-gray-400 italic">Umum</span>
        },
        {
            header: 'Waktu',
            accessor: 'created_at', // defaulting to created_at since waktu_hadir is missing
            className: 'text-gray-500',
            render: (row) => new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => <Badge status={row.status} variant={row.status === 'hadir' ? 'success' : 'warning'} />
        }
    ];

    const filteredData = presensiList.filter(p =>
        p.warga?.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Presensi</h1>
                    <p className="text-gray-500">Data kehadiran harian</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={filterKelas}
                        onChange={e => setFilterKelas(e.target.value)}
                        className="min-w-[150px]"
                    >
                        <option value="all">Semua Kelas</option>
                        <option value="null">Umum (Tanpa Kelas)</option>
                        {kelasList.map(k => (
                            <option key={k.id} value={k.id}>{k.nama}</option>
                        ))}
                    </Select>

                    <Select
                        value={filterSesi}
                        onChange={e => setFilterSesi(e.target.value)}
                        className="min-w-[150px]"
                    >
                        <option value="all">Semua Sesi</option>
                        {SESI_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </Select>

                    <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-auto" />
                </div>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                    <Input icon={Search} placeholder="Cari nama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-md" />
                    <div className="text-sm text-gray-500">
                        Total Hadir: <span className="font-bold text-gray-900">{filteredData.length}</span>
                    </div>
                </div>
                <Table columns={columns} data={filteredData} isLoading={loading} className="border-0 shadow-none rounded-none" />
            </Card>
        </div>
    );
};

export default Presensi;
