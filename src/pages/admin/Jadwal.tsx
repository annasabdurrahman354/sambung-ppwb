import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../api/supabase';
import { DAYS } from '../../utils/time';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import Table, { Column } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { Jadwal as JadwalType, Sesi as SesiType, Kelas as KelasType } from '../../types';

// Extended interface for fetching joined data
interface JadwalWithKelas extends JadwalType {
    kelas?: Pick<KelasType, 'nama'> | null;
}

const SESI_OPTIONS: SesiType[] = ['fajar', 'pagi_1', 'pagi_2', 'siang', 'sore', 'maghrib', 'malam'];

const HARI_ORDER: Record<string, number> = {
    'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7
};

const SESI_ORDER: Record<string, number> = {
    'fajar': 1, 'pagi_1': 2, 'pagi_2': 3, 'siang': 4, 'sore': 5, 'maghrib': 6, 'malam': 7
};

const Jadwal = () => {
    const [jadwalList, setJadwalList] = useState<JadwalWithKelas[]>([]);
    const [kelasList, setKelasList] = useState<KelasType[]>([]);
    const [filterKelas, setFilterKelas] = useState<string>('all');
    const [filterHari, setFilterHari] = useState<string>('all');
    const [filterSesi, setFilterSesi] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Partial<JadwalType>>({
        id: undefined, sesi: 'fajar', hari: 'Senin',
        waktu_mulai_presensi: '07:00:00', waktu_selesai_presensi: '08:00:00',
        aktif: true,
        kelas_id: '' // Start empty
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // Fetch Jadwal with Kelas
        const { data: jadwalData, error: jadwalError } = await supabase
            .from('jadwal')
            .select('*, kelas (nama)');

        if (jadwalData) {
            const sortedData = (jadwalData || []).sort((a: JadwalWithKelas, b: JadwalWithKelas) => {
                const kelasA = a.kelas?.nama || 'zzzz';
                const kelasB = b.kelas?.nama || 'zzzz';
                if (kelasA !== kelasB) return kelasA.localeCompare(kelasB);

                const hariA = HARI_ORDER[a.hari] || 99;
                const hariB = HARI_ORDER[b.hari] || 99;
                if (hariA !== hariB) return hariA - hariB;

                const sesiA = SESI_ORDER[a.sesi] || 99;
                const sesiB = SESI_ORDER[b.sesi] || 99;
                return sesiA - sesiB;
            });
            setJadwalList(sortedData);
        }

        // Fetch Kelas options
        const { data: kelasData } = await supabase.from('kelas').select('*').eq('aktif', true).order('nama');
        setKelasList(kelasData || []);

        setLoading(false);
    };

    const handleSubmit = async () => {
        const payload = {
            sesi: formData.sesi,
            hari: formData.hari,
            waktu_mulai_presensi: formData.waktu_mulai_presensi,
            waktu_selesai_presensi: formData.waktu_selesai_presensi,
            aktif: formData.aktif,
            kelas_id: formData.kelas_id || null // Handle empty string as null
        };

        if (formData.id) await supabase.from('jadwal').update(payload).eq('id', formData.id);
        else await supabase.from('jadwal').insert(payload);

        setShowModal(false);
        fetchData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this schedule?')) {
            await supabase.from('jadwal').delete().eq('id', id);
            fetchData();
        }
    };

    const openEdit = (row: JadwalWithKelas) => {
        setFormData({
            ...row,
            kelas_id: row.kelas_id || ''
        });
        setShowModal(true);
    };

    const openAdd = () => {
        setFormData({
            id: undefined, sesi: 'fajar', hari: 'Senin',
            waktu_mulai_presensi: '07:00:00', waktu_selesai_presensi: '08:00:00',
            aktif: true,
            kelas_id: ''
        });
        setShowModal(true);
    };

    const columns: Column<JadwalWithKelas>[] = [
        {
            header: 'Kelas',
            accessor: 'kelas',
            className: 'font-medium text-gray-900',
            render: (row) => row.kelas?.nama ? <Badge status={row.kelas.nama} variant="info" /> : <span className="text-gray-400 italic">Semua</span>
        },
        { header: 'Hari', accessor: 'hari', className: 'text-gray-500' },
        { header: 'Sesi', accessor: 'sesi', className: 'text-gray-500 capitalize', render: (row) => row.sesi.replace('_', ' ') },
        { header: 'Jam Mulai', accessor: 'waktu_mulai_presensi', className: 'text-gray-500' },
        { header: 'Jam Selesai', accessor: 'waktu_selesai_presensi', className: 'text-gray-500' },
        { header: 'Status', accessor: 'aktif', render: (row) => <Badge status={row.aktif ? 'Active' : 'Inactive'} variant={row.aktif ? 'success' : 'neutral'} /> }
    ];

    const actions = (row: JadwalWithKelas) => (
        <div className="flex justify-end gap-2">
            <button onClick={() => openEdit(row)} className="p-2 hover:bg-gray-100 rounded-full text-blue-600"><Edit2 size={16} /></button>
            <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-50 rounded-full text-red-600"><Trash2 size={16} /></button>
        </div>
    );

    const filteredData = jadwalList.filter(item => {
        const matchesKelas = filterKelas === 'all' ? true : (filterKelas === 'null' ? !item.kelas_id : item.kelas_id === filterKelas);
        const matchesHari = filterHari === 'all' ? true : item.hari === filterHari;
        const matchesSesi = filterSesi === 'all' ? true : item.sesi === filterSesi;

        return matchesKelas && matchesHari && matchesSesi;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Jadwal</h1>
                    <p className="text-gray-500">Atur waktu sesi presensi per kelas</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select
                        className="min-w-[150px]"
                        value={filterKelas}
                        onChange={e => setFilterKelas(e.target.value)}
                    >
                        <option value="all">Semua Kelas</option>
                        <option value="null">Umum (Tanpa Kelas)</option>
                        {kelasList.map(k => (
                            <option key={k.id} value={k.id}>{k.nama}</option>
                        ))}
                    </Select>

                    <Select
                        className="min-w-[120px]"
                        value={filterHari}
                        onChange={e => setFilterHari(e.target.value)}
                    >
                        <option value="all">Semua Hari</option>
                        {DAYS.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </Select>

                    <Select
                        className="min-w-[120px]"
                        value={filterSesi}
                        onChange={e => setFilterSesi(e.target.value)}
                    >
                        <option value="all">Semua Sesi</option>
                        {SESI_OPTIONS.map(sesi => (
                            <option key={sesi} value={sesi} className="capitalize">{sesi.replace('_', ' ')}</option>
                        ))}
                    </Select>

                    <Button onClick={openAdd}><Plus size={18} className="mr-2" /> Tambah</Button>
                </div>
            </div>

            <Card noPadding>
                <Table columns={columns} data={filteredData} actions={actions} isLoading={loading} className="border-0 shadow-none rounded-none" />
            </Card>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={formData.id ? "Edit Jadwal" : "Tambah Jadwal"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                        <select
                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#134E35]"
                            value={formData.kelas_id || ''}
                            onChange={e => setFormData({ ...formData, kelas_id: e.target.value })}
                        >
                            <option value="">Semua Kelas / Umum</option>
                            {kelasList.map(k => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Kosongkan untuk jadwal umum (semua kelas)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sesi</label>
                        <select
                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#134E35]"
                            value={formData.sesi}
                            onChange={e => setFormData({ ...formData, sesi: e.target.value as SesiType })}
                        >
                            {SESI_OPTIONS.map(sesi => <option key={sesi} value={sesi} className="capitalize">{sesi.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                        <select
                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#134E35]"
                            value={formData.hari}
                            onChange={e => setFormData({ ...formData, hari: e.target.value as any })}
                        >
                            {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                            <Input type="time" step="1" value={formData.waktu_mulai_presensi || ''} onChange={e => setFormData({ ...formData, waktu_mulai_presensi: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                            <Input type="time" step="1" value={formData.waktu_selesai_presensi || ''} onChange={e => setFormData({ ...formData, waktu_selesai_presensi: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#134E35]"
                            value={formData.aktif ? 'true' : 'false'}
                            onChange={e => setFormData({ ...formData, aktif: e.target.value === 'true' })}
                        >
                            <option value="true">Aktif</option>
                            <option value="false">Non-Aktif</option>
                        </select>
                    </div>
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>Batal</Button>
                        <Button className="flex-1" onClick={handleSubmit}>Simpan</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Jadwal;
