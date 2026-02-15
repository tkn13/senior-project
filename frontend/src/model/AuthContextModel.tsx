export interface AuthContextType {
    user: string | null;
    login?: (username: string, password: string) => Promise<void>;
    logout?: () => Promise<void>;
    isLoading?: boolean;
}