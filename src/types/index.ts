/* =======================
   ENUM TYPES
======================= */

export type JenisKelamin = 'L' | 'P';

export type Sesi =
    | 'fajar'
    | 'pagi_1'
    | 'pagi_2'
    | 'siang'
    | 'sore'
    | 'maghrib'
    | 'malam';

export type StatusPresensi =
    | 'hadir'
    | 'izin'
    | 'sakit'
    | 'alpa';

/* =======================
   BASE MODEL
======================= */

export interface BaseModel {
    id: string;
    created_at: string;
}

/* =======================
   WARGA
======================= */

export interface Warga extends BaseModel {
    nama: string;
    jenis_kelamin: JenisKelamin;
    kelompok?: string | null;
    rfid: string;
    aktif: boolean;
    updated_at: string;
}

/* =======================
   KELAS
======================= */

export interface Kelas extends BaseModel {
    nama: string;
    aktif: boolean;
    updated_at: string;
}

/* =======================
   KELAS ↔ WARGA
======================= */

export interface KelasWarga extends BaseModel {
    warga_id: string;
    kelas_id: string;
}

/* =======================
   JADWAL
======================= */

export type Hari =
    | 'Senin'
    | 'Selasa'
    | 'Rabu'
    | 'Kamis'
    | 'Jumat'
    | 'Sabtu'
    | 'Minggu';

export interface Jadwal extends BaseModel {
    kelas_id?: string | null;
    hari: Hari;
    sesi: Sesi;
    waktu_mulai_presensi: string;   // HH:mm:ss
    waktu_selesai_presensi: string; // HH:mm:ss
    aktif: boolean;
    updated_at: string;
}

/* =======================
   PRESENSI
======================= */

export interface Presensi extends BaseModel {
    warga_id: string;
    kelas_id?: string | null;
    tanggal: string; // YYYY-MM-DD
    sesi: Sesi;
    status: StatusPresensi;
}

/* =======================
   AUTH USER (ADMIN)
======================= */

export interface AuthUser {
    id: string;
    email: string;
    created_at: string;
}

/* =======================
   USER ROLE
======================= */

export interface UserRole {
    user_id: string;
    role: 'admin';
}

/* =======================
   JOIN / VIEW MODELS
   (Optional but useful)
======================= */

export interface PresensiWithWarga extends Presensi {
    warga: Pick<Warga, 'id' | 'nama' | 'rfid'>;
}

export interface JadwalWithKelas extends Jadwal {
    kelas?: Pick<Kelas, 'id' | 'nama'> | null;
}
