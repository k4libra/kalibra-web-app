
import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

const features = [
    {
        icon: "▤",
        title: "Material curricular por subtema",
        description: "Kalibra extrae el contenido y lo vincula a cada subtema.",
    },
    {
        icon: "✧",
        title: "Ejercicios verificados",
        description: "Todo ejercicio pasa la capa de verificación antes de publicarse.",
    },
    {
        icon: "⌁",
        title: "Mapa de brechas del grupo",
        description: "Prioriza qué reforzar según el dominio real por subtema.",
    },
];

export default function AuthLayout({
                                       children,
                                       title,
                                       description,
                                   }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f8f7fc] lg:grid lg:grid-cols-2">
            <aside className="flex min-h-[320px] flex-col bg-gradient-to-br from-[#4738ed] to-[#2912c9] px-8 py-10 text-white lg:min-h-screen lg:px-12">
                <div className="text-lg font-semibold">
                    <span className="mr-2 text-2xl">K</span>
                    Kalibra
                </div>

                <div className="my-auto py-12">
          <span className="rounded bg-white/15 px-3 py-1 text-xs">
            PORTAL DOCENTE
          </span>

                    <h1 className="mt-5 text-3xl font-bold">{title}</h1>
                    <p className="mt-3 max-w-md text-sm text-white/75">
                        {description}
                    </p>

                    <div className="mt-8 space-y-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="flex items-center gap-3 rounded-lg bg-white/10 p-3"
                            >
                <span className="rounded-md bg-white/15 p-2">
                  {feature.icon}
                </span>
                                <div>
                                    <p className="text-sm font-semibold">{feature.title}</p>
                                    <p className="text-xs text-white/70">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-white/60">
                    Tus datos académicos están protegidos
                </p>
            </aside>

            <main className="flex min-h-[500px] items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">{children}</div>
            </main>
        </div>
    );
}
