
import type {
    AuthUser,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from "../types/auth";

interface MockUser extends AuthUser {
    password: string;
}

// Usuarios de prueba almacenados únicamente en memoria.
// Nunca utilizar contraseñas en texto plano en producción.
const mockUsers: MockUser[] = [
    {
        id: "teacher-001",
        email: "docente@kalibra.com",
        password: "Kalibra123",
        role: "TEACHER",
    },
];

const simulateDelay = (ms = 500): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const createAuthResponse = (user: MockUser): AuthResponse => {
    return {
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        accessToken: `mock-token-${user.id}`,
    };
};

export const authMock = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        await simulateDelay();

        const email = data.email.trim().toLowerCase();

        const existingUser = mockUsers.find(
            (user) => user.email === email
        );

        if (existingUser) {
            throw new Error(
                "Este correo electrónico ya está registrado."
            );
        }

        if (data.password !== data.confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        const newUser: MockUser = {
            id: `teacher-${mockUsers.length + 1}`,
            email,
            password: data.password,
            role: "TEACHER",
        };

        mockUsers.push(newUser);

        return createAuthResponse(newUser);
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        await simulateDelay();

        const email = data.email.trim().toLowerCase();

        const user = mockUsers.find(
            (item) =>
                item.email === email &&
                item.password === data.password
        );

        if (!user) {
            throw new Error(
                "Correo electrónico o contraseña incorrectos."
            );
        }

        return createAuthResponse(user);
    },

    async logout(): Promise<void> {
        await simulateDelay(200);
    },
};
