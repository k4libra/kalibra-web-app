
import type {
    AuthUser,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
} from "../types/auth";

interface MockUser extends AuthUser {
    password: string;
}

// Datos simulados exclusivamente para desarrollo.
// No utilizar contraseñas en texto plano en producción.
const mockUsers: MockUser[] = [
    {
        id: 1,
        firstName: "Docente",
        lastName: "Prueba",
        email: "docente@kalibra.com",
        password: "Kalibra123",
        role: "TEACHER",
        status: true,
    },
];

const simulateDelay = (ms = 500): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const createAuthResponse = (
    user: MockUser
): AuthResponse => {
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
        },
        accessToken: `mock-token-${user.id}`,
    };
};

export const authMock = {
    async register(
        data: RegisterRequest
    ): Promise<AuthResponse> {
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

        if (!data.firstName.trim()) {
            throw new Error("El nombre es obligatorio.");
        }

        if (!data.lastName.trim()) {
            throw new Error("El apellido es obligatorio.");
        }

        if (data.password.length < 8) {
            throw new Error(
                "La contraseña debe tener al menos 8 caracteres."
            );
        }

        if (data.password !== data.confirmPassword) {
            throw new Error("Las contraseñas no coinciden.");
        }

        const nextId =
            Math.max(0, ...mockUsers.map((user) => user.id)) + 1;

        const newUser: MockUser = {
            id: nextId,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            email,
            password: data.password,
            role: "TEACHER",
            status: true,
        };

        mockUsers.push(newUser);

        return createAuthResponse(newUser);
    },

    async login(
        data: LoginRequest
    ): Promise<AuthResponse> {
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

        if (!user.status) {
            throw new Error(
                "Esta cuenta se encuentra desactivada."
            );
        }

        return createAuthResponse(user);
    },

    async logout(): Promise<void> {
        await simulateDelay(200);
    },
};
