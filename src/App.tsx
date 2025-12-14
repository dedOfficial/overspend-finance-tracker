import { useAuth } from "./contexts/AuthContext";
import { Auth } from "./components/Auth";
import { Layout } from "./components/Layout";
import { Routes, Route, Navigate } from "react-router";
import { routes } from "./routes";
import { Loader } from "./ui/Loader";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullWidth />;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.element />}
          />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
