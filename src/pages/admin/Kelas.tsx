import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../api/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table, { Column } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { Kelas as KelasType } from '../../types';

const Kelas = () => {
    const [kelasList, setKelasList] = useState<KelasType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<Partial<KelasType>>({ id: undefined, nama: '', aktif: true });

    const [page, setPage] = useState(1);
    const [pageSize] = useState(25);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    useEffect(() => {
        fetchKelas();
    }, [page, searchTerm]);

    const fetchKelas = async () => {
        setLoading(true);
        let query = supabase
            .from('kelas')
            .select('*', { count: 'exact' });

        if (searchTerm) {
            query = query.ilike('nama', `%${searchTerm}%`);
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await query
            .order('nama', { ascending: true })
            .range(from, to);

        if (error) console.error(error);
        else {
            setKelasList(data || []);
            setTotalItems(count || 0);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        const payload = { nama: formData.nama, aktif: formData.aktif };
        if (formData.id) await supabase.from('kelas').update(payload).eq('id', formData.id);
        else await supabase.from('kelas').insert(payload);
        setShowModal(false);
        fetchKelas();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this class?')) {
            await supabase.from('kelas').delete().eq('id', id);
            fetchKelas();
        }
    };

    const openEdit = (row: KelasType) => {
        setFormData({ id: row.id, nama: row.nama, aktif: row.aktif });
        setShowModal(true);
    };

    const openAdd = () => {
        setFormData({ id: undefined, nama: '', aktif: true });
        setShowModal(true);
    };

    const columns: Column<KelasType>[] = [
        { header: 'Nama Kelas', accessor: 'nama', className: 'font-medium text-gray-900' },
        { header: 'Status', accessor: 'aktif', render: (row) => <Badge status={row.aktif ? 'Active' : 'Inactive'} variant={row.aktif ? 'success' : 'neutral'} /> },
    ];

    const actions = (row: KelasType) => (
        <div className="flex justify-end gap-2">
            <button onClick={() => openEdit(row)} className="p-2 hover:bg-gray-100 rounded-full text-blue-600"><Edit2 size={16} /></button>
            <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-50 rounded-full text-red-600"><Trash2 size={16} /></button>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
                    <p className="text-gray-500">Atur daftar kelas / kelompok</p>
                </div>
                <Button onClick={openAdd}><Plus size={18} className="mr-2" /> Tambah Kelas</Button>
            </div>

            <Card noPadding>
                <div className="p-4 border-b border-gray-100">
                    <Input icon={Search} placeholder="Cari kelas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-md" />
                </div>
                <Table
                    columns={columns}
                    data={kelasList}
                    actions={actions}
                    isLoading={loading}
                    className="border-0 shadow-none rounded-none"
                    pagination={{
                        currentPage: page,
                        totalPages: Math.ceil(totalItems / pageSize),
                        onPageChange: setPage,
                        totalItems: totalItems,
                        pageSize: pageSize
                    }}
                />
            </Card>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={formData.id ? "Edit Kelas" : "Tambah Kelas"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                        <Input value={formData.nama || ''} onChange={e => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Kelas A" />
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

export default Kelas;
