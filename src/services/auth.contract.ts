
import type {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
} from "../types/auth";


export interface AuthServiceContract {
    /**
     * Registra un nuevo usuario.
     */
    register(data: RegisterRequest): Promise<AuthResponse>;

    /**
     * Inicia sesión con correo y contraseña.
     */
    login(data: LoginRequest): Promise<AuthResponse>;

    /**
     * Finaliza la sesión del usuario.
     */
    logout(): Promise<void>;
}
