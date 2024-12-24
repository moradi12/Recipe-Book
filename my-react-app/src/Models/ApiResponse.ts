// Models/ApiResponse.ts

export class ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;

    constructor(success: boolean, data: T | null = null, error: string | null = null) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}
