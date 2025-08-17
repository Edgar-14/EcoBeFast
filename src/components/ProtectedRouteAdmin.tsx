import { useAuth } from "@/app/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
    // Aquí puedes agregar lógica para verificar el rol de admin en Firestore
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return <>{children}</>;
}
