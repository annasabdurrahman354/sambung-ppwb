import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../api/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table, { Column } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import MultiSelect from '../../components/ui/MultiSelect';
import Select from '../../components/ui/Select';
import { Warga as WargaType, JenisKelamin, Kelas } from '../../types';

interface WargaWithKelas extends WargaType {
    kelas_warga?: {
        kelas: {
            id: string;
            nama: string;
        } | null;
    }[];
}

const Warga = () => {
    const [wargaList, setWargaList] = useState<WargaWithKelas[]>([]);
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Partial<WargaType> & { kelasIds: string[] }>({
        id: undefined, nama: '', rfid: '', aktif: true,
        jenis_kelamin: 'L', kelompok: '', kelasIds: []
    });

    const [statusSelect, setStatusSelect] = useState<'aktif' | 'nonaktif'>('aktif');
    const [selectedKelas, setSelectedKelas] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchWarga(), fetchKelas()]);
        setLoading(false);
    };

    const fetchKelas = async () => {
        const { data } = await supabase.from('kelas').select('*').eq('aktif', true).order('nama');
        setKelasList(data || []);
    };

    const fetchWarga = async () => {
        // setLoading(true); // Handled in fetchData
        const { data, error } = await supabase
            .from('warga')
            .select('*, kelas_warga(kelas(id, nama))')
            .order('nama', { ascending: true });

        if (error) console.error(error);
        else setWargaList(data || []);
        // setLoading(false);
    };

    const handleSubmit = async () => {
        const payload = {
            nama: formData.nama,
            rfid: formData.rfid,
            aktif: statusSelect === 'aktif',
            jenis_kelamin: formData.jenis_kelamin,
            kelompok: formData.kelompok || null
        };

        let wargaId = formData.id;

        if (wargaId) {
            await supabase.from('warga').update(payload).eq('id', wargaId);
        } else {
            const { data, error } = await supabase.from('warga').insert(payload).select().single();
            if (error) {
                console.error(error);
                return;
            };
            wargaId = data.id;
        }

        // Handle Kelas Assignment
        if (wargaId) {
            // 1. Delete existing
            await supabase.from('kelas_warga').delete().eq('warga_id', wargaId);

            // 2. Insert new
            if (formData.kelasIds && formData.kelasIds.length > 0) {
                const kelasPayload = formData.kelasIds.map(kId => ({
                    warga_id: wargaId,
                    kelas_id: kId
                }));
                await supabase.from('kelas_warga').insert(kelasPayload);
            }
        }

        setShowModal(false);
        fetchWarga();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this member?')) {
            await supabase.from('warga').delete().eq('id', id);
            fetchWarga();
        }
    };

    const openEdit = (warga: WargaType) => {
        const wargaWithKelas = warga as WargaWithKelas;
        setFormData({
            id: warga.id,
            nama: warga.nama,
            rfid: warga.rfid,
            aktif: warga.aktif,
            jenis_kelamin: warga.jenis_kelamin,
            kelompok: warga.kelompok || '',
            kelasIds: wargaWithKelas.kelas_warga?.map(kw => kw.kelas?.id ? String(kw.kelas.id) : '').filter(Boolean) || []
        });
        setStatusSelect(warga.aktif ? 'aktif' : 'nonaktif');
        setShowModal(true);
    };

    const openAdd = () => {
        setFormData({ id: undefined, nama: '', rfid: '', jenis_kelamin: 'L', kelompok: '', kelasIds: [] });
        setStatusSelect('aktif');
        setShowModal(true);
    };

    const filteredData = wargaList.filter(w => {
        const matchesSearch = w.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.rfid.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesKelas = selectedKelas === 'all' ||
            w.kelas_warga?.some(kw => kw.kelas?.id === selectedKelas);

        return matchesSearch && matchesKelas;
    });

    const columns: Column<WargaWithKelas>[] = [
        { header: 'Nama', accessor: 'nama', className: 'font-medium text-gray-900' },
        { header: 'L/P', accessor: 'jenis_kelamin', className: 'text-gray-500' },
        {
            header: 'Kelas',
            accessor: 'id', // dummy accessor
            render: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.kelas_warga && row.kelas_warga.length > 0 ? (
                        row.kelas_warga.map((kw, idx) => (
                            kw.kelas ? <Badge key={idx} variant="neutral" className="border border-gray-200">{kw.kelas.nama}</Badge> : null
                        ))
                    ) : (
                        <span className="text-gray-400 text-xs italic">-</span>
                    )}
                </div>
            )
        },
        // { header: 'Kelompok', accessor: 'kelompok', className: 'text-gray-500' }, // Deprecated visually, but keeping data
        { header: 'RFID', accessor: 'rfid', className: 'text-gray-500' },
        {
            header: 'Status',
            accessor: 'aktif',
            render: (row) => <Badge status={row.aktif ? 'Active' : 'Inactive'} variant={row.aktif ? 'success' : 'neutral'} />
        }
    ];

    const actions = (row: WargaType) => (
        <div className="flex justify-end gap-2">
            <button onClick={() => openEdit(row)} className="p-2 hover:bg-gray-100 rounded-full text-blue-600">
                <Edit2 size={16} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-50 rounded-full text-red-600">
                <Trash2 size={16} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Warga</h1>
                    <p className="text-gray-500">Kelola data warga dan kartu RFID</p>
                </div>
                <Button onClick={openAdd} className="shrink-0">
                    <Plus size={18} className="mr-2" />
                    Tambah Warga
                </Button>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 max-w-md">
                        <Input
                            icon={Search}
                            placeholder="Cari nama atau RFID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={selectedKelas}
                            onChange={(e) => setSelectedKelas(e.target.value)}
                            className="min-w-[200px]"
                        >
                            <option value="all">Semua Kelas</option>
                            {kelasList.map(k => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </Select>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={filteredData}
                    actions={actions}
                    isLoading={loading}
                    className="border-0 shadow-none rounded-none"
                />
            </Card>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={formData.id ? "Edit Warga" : "Tambah Warga Baru"}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <Input
                            value={formData.nama || ''}
                            onChange={e => setFormData({ ...formData, nama: e.target.value })}
                            placeholder="Contoh: Ahmad Fulan"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                            <Select
                                value={formData.jenis_kelamin}
                                onChange={e => setFormData({ ...formData, jenis_kelamin: e.target.value as JenisKelamin })}
                            >
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok</label>
                        <Input
                            value={formData.kelompok || ''}
                            onChange={e => setFormData({ ...formData, kelompok: e.target.value })}
                            placeholder="Masukkan Kelompok"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                        <MultiSelect
                            options={kelasList.map(k => ({ label: k.nama, value: String(k.id) }))}
                            selected={formData.kelasIds || []}
                            onChange={(selected) => setFormData(prev => ({ ...prev, kelasIds: selected }))}
                            placeholder="Pilih Kelas..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RFID / UID Kartu</label>
                        <Input
                            value={formData.rfid || ''}
                            onChange={e => setFormData({ ...formData, rfid: e.target.value })}
                            placeholder="Scan kartu atau ketik manual"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Keaktifan</label>
                        <Select
                            value={statusSelect}
                            onChange={e => setStatusSelect(e.target.value as 'aktif' | 'nonaktif')}
                        >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Non-Aktif</option>
                        </Select>
                    </div>
                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
                            Batal
                        </Button>
                        <Button className="flex-1" onClick={handleSubmit}>
                            Simpan Data
                        </Button>
                    </div>
                </div>
            </Modal >
        </div >
    );
};

export default Warga;
