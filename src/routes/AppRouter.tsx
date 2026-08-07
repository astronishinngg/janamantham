const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  // Check localStorage directly for the prototype
  const isAuthenticated = localStorage.getItem("jm_authenticated") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  // Check localStorage directly for the prototype
  const isAuthenticated = localStorage.getItem("jm_authenticated") === "true";
  return !isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.DASHBOARD} replace />;
};