import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RequireAuth({
  children,
  adminOnly = false,
}: {
  children: JSX.Element;
  adminOnly?: boolean;
}) {
  const { user, isAdmin, loading } = useAuth();
  const loc = useLocation();
  if (loading) {
    return <div className="container py-16 text-muted-foreground">Loading…</div>;
  }
  if (!user) {
    return <Navigate to={`/auth?next=${encodeURIComponent(loc.pathname)}`} replace />;
  }
  if (adminOnly && !isAdmin) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-semibold">Admin access required</h1>
        <p className="text-muted-foreground mt-2">
          Sign in with the admin email to view this page.
        </p>
      </div>
    );
  }
  return children;
}
