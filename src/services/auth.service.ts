
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
} from "../types/auth";

import type { AuthServiceContract } from "./auth.contract";
import { authMock } from "../mocks/auth.mock";


class AuthService implements AuthServiceContract {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        return authMock.register(data);
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        return authMock.login(data);
    }

    async logout(): Promise<void> {
        return authMock.logout();
    }
}

export const authService: AuthServiceContract = new AuthService();
