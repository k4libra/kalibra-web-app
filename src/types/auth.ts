
export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    role: "TEACHER" | "STUDENT";
}

export interface AuthResponse {
    user: AuthUser;
    accessToken: string;
}

export interface AuthError {
    message: string;
    code?: string;
}
