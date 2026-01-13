import { useState, useEffect } from 'react';
import { useRFIDScanner } from '../hooks/useRFIDScanner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';
import { getCurrentDayName, isTimeInRange, formatDate } from '../utils/time';
import { useAuth } from '../context/AuthContext';
import { Scan, CheckCircle, XCircle, Loader, LayoutDashboard, LogIn, School, ChevronRight, Settings, Lock, Unlock, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import { Jadwal, Warga, Sesi, Kelas } from '../types';

interface JadwalWithKelas extends Jadwal {
    kelas?: {
        id: string;
        nama: string;
    } | null;
}

type Mode = 'auto' | 'manual';
type ManualType = 'specific' | 'general'; // Specific Class vs Umum

const SESI_OPTIONS: { label: string; value: Sesi }[] = [
    { label: 'Fajar', value: 'fajar' },
    { label: 'Pagi 1', value: 'pagi_1' },
    { label: 'Pagi 2', value: 'pagi_2' },
    { label: 'Siang', value: 'siang' },
    { label: 'Sore', value: 'sore' },
    { label: 'Maghrib', value: 'maghrib' },
    { label: 'Malam', value: 'malam' },
];

const PresensiPublic = () => {
    // UI State
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [wargaName, setWargaName] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // Config State
    const [mode, setMode] = useState<Mode>('auto');
    const [manualType, setManualType] = useState<ManualType>('specific');
    const [manualClassId, setManualClassId] = useState<string>('umum');
    const [manualSesi, setManualSesi] = useState<Sesi | ''>('');
    const [configLocked, setConfigLocked] = useState(false);

    // Data State
    const [kelasList, setKelasList] = useState<Kelas[]>([]);

    // Multi-class handling (Auto Mode)
    const [showClassModal, setShowClassModal] = useState(false);
    const [activeSchedules, setActiveSchedules] = useState<JadwalWithKelas[]>([]);
    const [pendingWarga, setPendingWarga] = useState<Warga | null>(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Classes
    useEffect(() => {
        const fetchKelas = async () => {
            const { data } = await supabase.from('kelas').select('*').eq('aktif', true).order('nama');
            setKelasList(data || []);
        };
        fetchKelas();
    }, []);

    // Handle Class Selection Change in Manual Mode
    const handleManualClassChange = async (classId: string) => {
        setManualClassId(classId);

        if (classId === 'umum') {
            setManualType('general');
            setManualSesi(''); // User must pick sesi
        } else {
            setManualType('specific');
            // Auto-fetch current schedule for this class
            const currentDay = getCurrentDayName();
            const { data: schedules } = await supabase
                .from('jadwal')
                .select('*')
                .eq('kelas_id', classId)
                .eq('hari', currentDay)
                .eq('aktif', true);

            const activeSchedule = schedules?.find((j: Jadwal) =>
                isTimeInRange(j.waktu_mulai_presensi, j.waktu_selesai_presensi)
            );

            if (activeSchedule) {
                setManualSesi(activeSchedule.sesi);
            } else {
                setManualSesi(''); // No active schedule found
            }
        }
    };

    const resetState = () => {
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
            setWargaName('');
            setPendingWarga(null);
            setActiveSchedules([]);
        }, 3000);
    };

    const processManualScan = async (warga: Warga) => {
        if (!manualSesi) {
            throw new Error('Sesi belum dipilih/tersedia.');
        }

        const today = new Date().toISOString().split('T')[0];
        const targetKelasId = manualType === 'specific' ? manualClassId : null;

        // Check duplicate
        let query = supabase
            .from('presensi')
            .select('*')
            .eq('warga_id', warga.id)
            .eq('tanggal', today)
            .eq('sesi', manualSesi);

        if (targetKelasId) {
            query = query.eq('kelas_id', targetKelasId);
        } else {
            // For general presence, we might want to check if ANY presence exists for this session regardless of class?
            // Or specifically check for null class_id. 
            // "jika ada rfid yang terdeteksi cek apakah ada warga dengan rfid tersebut, jika ada langsung buat presensi, untuk tanggal sekarang, dan sesi sekarang"
            // Assuming strict duplicates check.
            query = query.is('kelas_id', null);
        }

        const { data: existing } = await query.maybeSingle();

        if (existing) {
            setStatus('success');
            setMessage(`Anda sudah presensi (${manualSesi})`);
            return;
        }

        // Insert
        const { error } = await supabase.from('presensi').insert({
            warga_id: warga.id,
            kelas_id: targetKelasId,
            tanggal: today,
            sesi: manualSesi,
            status: 'hadir'
        });

        if (error) throw error;

        setStatus('success');
        setMessage('Presensi Berhasil!');
    };

    const processAutoScan = async (warga: Warga) => {
        // 2. Find Warga's Classes
        const { data: kelasWarga, error: kwError } = await supabase
            .from('kelas_warga')
            .select('kelas_id')
            .eq('warga_id', warga.id);

        if (kwError) throw kwError;

        if (!kelasWarga || kelasWarga.length === 0) {
            throw new Error('Tidak terdaftar di kelas manapun.');
        }

        const kelasIds = kelasWarga.map(kw => kw.kelas_id);

        // 3. Find Active Schedules for these classes
        const currentDay = getCurrentDayName();
        const { data: schedules, error: jadwalError } = await supabase
            .from('jadwal')
            .select('*, kelas:kelas_id(id, nama)')
            .in('kelas_id', kelasIds)
            .eq('hari', currentDay)
            .eq('aktif', true);

        if (jadwalError) throw jadwalError;

        // Filter by time range
        const validSchedules = (schedules as JadwalWithKelas[] || []).filter(j =>
            isTimeInRange(j.waktu_mulai_presensi, j.waktu_selesai_presensi)
        );

        if (validSchedules.length === 0) {
            throw new Error('Tidak terdapat jadwal pengajian saat ini.');
        }

        // 4. Handle Single vs Multiple Schedules
        if (validSchedules.length === 1) {
            await executePresensi(warga, validSchedules[0]);
        } else {
            // Multiple schedules found -> Let user select
            setPendingWarga(warga);
            setActiveSchedules(validSchedules);
            setShowClassModal(true);
            setStatus('idle'); // Pause loader to show modal
            setMessage('Pilih Kelas');
        }
    };

    const executePresensi = async (warga: Warga, jadwal: JadwalWithKelas) => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Check if already present
            const { data: existingPresensi } = await supabase
                .from('presensi')
                .select('*')
                .eq('warga_id', warga.id)
                .eq('tanggal', today)
                .eq('sesi', jadwal.sesi)
                .eq('kelas_id', jadwal.kelas_id) // Specific to class
                .maybeSingle();

            if (existingPresensi) {
                setStatus('success');
                setMessage(`Sudah presensi: ${jadwal.kelas?.nama} - ${jadwal.sesi.replace('_', ' ')}`);
                resetState();
                return;
            }

            // Record Presensi
            const { error: insertError } = await supabase
                .from('presensi')
                .insert({
                    warga_id: warga.id,
                    kelas_id: jadwal.kelas_id,
                    tanggal: today,
                    sesi: jadwal.sesi,
                    status: 'hadir'
                });

            if (insertError) throw insertError;

            setStatus('success');
            setMessage(`Presensi Berhasil: ${jadwal.kelas?.nama}`);
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'Gagal menyimpan data presensi.');
        } finally {
            resetState();
        }
    };

    const processScan = async (scannedCode: string) => {
        if (!scannedCode) return;
        if (mode === 'manual' && !configLocked) return; // Don't scan if locked not active in manual

        setStatus('loading');
        setMessage('Memproses...');
        setWargaName('');
        setShowClassModal(false);

        try {
            // Shared: Find Warga
            const { data: warga, error: wargaError } = await supabase
                .from('warga')
                .select('*')
                .eq('rfid', scannedCode)
                .single();

            if (wargaError || !warga) {
                throw new Error('RFID tidak terdaftar.');
            }

            setWargaName(warga.nama);

            if (!warga.aktif) {
                throw new Error(`Warga ${warga.nama} tidak aktif.`);
            }

            if (mode === 'auto') {
                await processAutoScan(warga);
            } else {
                await processManualScan(warga);
            }

        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setMessage(err.message || 'Terjadi kesalahan sistem.');
            resetState();
        }
    };

    const handleClassSelect = async (jadwal: JadwalWithKelas) => {
        setShowClassModal(false);
        if (pendingWarga) {
            setStatus('loading');
            await executePresensi(pendingWarga, jadwal);
        }
    };

    useRFIDScanner(processScan, { length: 10, timeout: 200 });

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-gray-900 selection:bg-emerald-200">
            {/* Ambient Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-400/20 rounded-full blur-[100px] animate-pulse mix-blend-multiply" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-400/20 rounded-full blur-[100px] animate-pulse mix-blend-multiply" style={{ animationDuration: '7s' }} />
                <div className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-teal-300/20 rounded-full blur-[80px] animate-pulse mix-blend-multiply" style={{ animationDuration: '5s' }} />
            </div>

            {/* Admin Access Button */}
            {user ? (
                <div className="absolute top-6 right-6 z-50 animate-in fade-in duration-1000">
                    <Button
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-white/50 hover:bg-white/80 text-emerald-900 border border-white/50 backdrop-blur-md shadow-lg transition-all"
                    >
                        <LayoutDashboard size={18} className="mr-2" />
                        Admin Panel
                    </Button>
                </div>
            ) : (
                <div className="absolute top-6 right-6 z-50 animate-in fade-in duration-1000">
                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-white/50 hover:bg-white/80 text-emerald-900 border border-white/50 backdrop-blur-md shadow-lg transition-all"
                    >
                        <LogIn size={18} className="mr-2" />
                        Login
                    </Button>
                </div>
            )}

            <div className="relative z-10 w-full max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">

                {/* Clock */}
                <div className="space-y-2">
                    <h1 className="text-7xl md:text-9xl font-black text-[#134E35] tracking-tighter drop-shadow-sm">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h1>
                    <p className="text-2xl text-gray-500 font-medium tracking-wide uppercase">
                        {formatDate(currentTime)}
                    </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex justify-center gap-2 mb-4">
                    <div className="bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white/50 flex shadow-sm">
                        <button
                            onClick={() => { setMode('auto'); setConfigLocked(false); }}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                mode === 'auto' ? "bg-white text-[#134E35] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <RefreshCw size={16} className={cn(mode === 'auto' ? "animate-spin-slow" : "")} />
                            Otomatis
                        </button>
                        <button
                            onClick={() => setMode('manual')}
                            className={cn(
                                "px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                                mode === 'manual' ? "bg-white text-[#134E35] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Settings size={16} />
                            Manual
                        </button>
                    </div>
                </div>

                {/* Manual Config Panel */}
                {mode === 'manual' && !configLocked && (
                    <Card className="bg-white/60 backdrop-blur-xl border-white/70 mx-auto max-w-md animate-in slide-in-from-bottom-2">
                        <div className="p-6 space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Pilih Kelas</label>
                                <Select
                                    value={manualClassId}
                                    onChange={(e) => handleManualClassChange(e.target.value)}
                                >
                                    <option value="umum">Umum (Tidak Ada Kelas)</option>
                                    {kelasList.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama}</option>
                                    ))}
                                </Select>
                            </div>

                            {manualClassId === 'umum' ? (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Pilih Sesi</label>
                                    <Select
                                        value={manualSesi}
                                        onChange={(e) => setManualSesi(e.target.value as Sesi)}
                                    >
                                        <option value="" disabled>Pilih Sesi...</option>
                                        {SESI_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </Select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5 ml-1">Sesi Aktif</label>
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-xl border w-full text-sm font-medium",
                                        manualSesi ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
                                    )}>
                                        {manualSesi ? `Sesi: ${manualSesi}` : 'Kelas tidak memiliki jadwal aktif saat ini'}
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full mt-2"
                                disabled={!manualSesi}
                                onClick={() => setConfigLocked(true)}
                            >
                                <Lock size={16} className="mr-2" />
                                Kunci & Mulai Absen
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Main Scan Card */}
                {/* Show Scan Card if Auto Mode OR (Manual Mode AND Config is Locked) */}
                {(mode === 'auto' || (mode === 'manual' && configLocked)) && (
                    <Card className={cn(
                        "border border-white/60 bg-white/40 backdrop-blur-2xl shadow-2xl shadow-emerald-900/5 overflow-hidden transition-all duration-300 rounded-[32px]",
                        status === 'error' && "bg-red-50/50 ring-2 ring-red-400/50 border-red-200",
                        status === 'success' && "bg-emerald-50/50 ring-2 ring-emerald-400/50 border-emerald-200"
                    )}>
                        <div className="p-12 space-y-8 relative">
                            {/* Unlock Button for Manual Mode */}
                            {mode === 'manual' && configLocked && status === 'idle' && (
                                <button
                                    onClick={() => setConfigLocked(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-full transition-colors"
                                    title="Buka Pengaturan Presensi"
                                >
                                    <Unlock size={20} />
                                </button>
                            )}

                            {status === 'idle' && !showClassModal && (
                                <div className="flex flex-col items-center gap-6 text-gray-400">
                                    <div className="p-6 bg-white/50 rounded-full shadow-lg shadow-emerald-900/5">
                                        <Scan size={64} className="animate-pulse text-[#134E35]" />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-2xl font-light text-gray-600 block">Tempelkan Kartu RFID Anda</span>
                                        {mode === 'manual' && (
                                            <span className="text-sm font-medium text-emerald-600 mt-2 block bg-emerald-50 px-3 py-1 rounded-full mx-auto w-fit">
                                                Mode Manual: {manualClassId === 'umum' ? 'Umum' : kelasList.find(k => k.id === manualClassId)?.nama} • {manualSesi}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {status === 'loading' && (
                                <div className="flex flex-col items-center gap-6 text-blue-400">
                                    <Loader size={80} className="animate-spin" />
                                    <span className="text-2xl font-light">Memproses Data...</span>
                                </div>
                            )}

                            {status === 'success' && (
                                <div className="flex flex-col items-center gap-6 text-emerald-600 animate-in zoom-in duration-300">
                                    <div className="p-4 bg-emerald-100 rounded-full">
                                        <CheckCircle size={80} />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 mb-2">{wargaName}</h2>
                                        <span className="text-2xl font-light text-gray-600">{message}</span>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="flex flex-col items-center gap-6 text-red-500 animate-in shake duration-300">
                                    <div className="p-4 bg-red-100 rounded-full">
                                        <XCircle size={80} />
                                    </div>
                                    <div>
                                        {wargaName && <h2 className="text-3xl font-bold text-gray-900 mb-2">{wargaName}</h2>}
                                        <span className="text-2xl font-medium">{message}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Multiple Class Selection Modal */}
            <Modal
                isOpen={showClassModal}
                onClose={() => {
                    setShowClassModal(false);
                    setPendingWarga(null);
                    setStatus('idle');
                }}
                title="Pilih Kelas Presensi"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">Halo <strong>{wargaName}</strong>, Anda memiliki beberapa jadwal aktif. Silakan pilih kelas:</p>
                    <div className="grid gap-3">
                        {activeSchedules.map((jadwal) => (
                            <button
                                key={jadwal.id}
                                onClick={() => handleClassSelect(jadwal)}
                                className="flex items-center justify-between w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-[#134E35]/5 hover:border-[#134E35] transition-all group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-[#134E35] group-hover:text-white transition-colors">
                                        <School size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{jadwal.kelas?.nama}</h3>
                                        <p className="text-sm text-gray-500">
                                            {jadwal.sesi} ({jadwal.waktu_mulai_presensi.slice(0, 5)} - {jadwal.waktu_selesai_presensi.slice(0, 5)})
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="text-gray-400 group-hover:text-[#134E35] group-hover:translate-x-1 transition-all" size={20} />
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PresensiPublic;
