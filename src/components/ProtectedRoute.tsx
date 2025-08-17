import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

// Aquí puedes expandir la lógica para roles y Firestore si lo deseas
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/delivery/login"); // Redirige a login si no está autenticado
    }
    // Aquí podrías agregar lógica para roles usando Firestore
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return <>{children}</>;
}
