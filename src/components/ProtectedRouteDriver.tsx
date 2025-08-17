import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouteDriver({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/drivers/login");
    }
    // Aquí puedes agregar lógica para verificar el rol de conductor en Firestore
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return <>{children}</>;
}
