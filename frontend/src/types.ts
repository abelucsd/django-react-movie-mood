export interface AccountResponse {
    user: {
        id: string;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
    }
    access: string;
    refresh: string;
}