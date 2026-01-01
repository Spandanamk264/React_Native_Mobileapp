import { format, parseISO } from 'date-fns';

export const formatDuration = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${pad(minutes)}:${pad(seconds)}`;
};

export const formatSessionDate = (isoString: string): string => {
    try {
        const date = parseISO(isoString);
        // Format: "Jan 14, 2024 • 02:30 PM"
        return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (e) {
        return isoString;
    }
};
