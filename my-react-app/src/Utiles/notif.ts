import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyfInstance = new Notyf({ duration: 4000, position: { x: 'center', y: 'top' } });

export const notify = {
    success: (message: string) => notyfInstance.success(message),
    error: (message: string) => notyfInstance.error(message),
    warn: (message: string) => notyfInstance.error(message), // Use error style for warnings
    info: (message: string) => notyfInstance.success(message), // Use success style for info
};