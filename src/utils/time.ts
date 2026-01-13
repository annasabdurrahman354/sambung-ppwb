export const DAYS: string[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const getCurrentDayName = (): string => {
    const today = new Date();
    return DAYS[today.getDay()];
};

export const isTimeInRange = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const currentTime = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

    return currentTime >= startTime && currentTime <= endTime;
};

export const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'medium'
    }).format(d);
};
