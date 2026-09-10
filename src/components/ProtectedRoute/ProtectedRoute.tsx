import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function verifyToken() {
            const token = localStorage.getItem("token");

            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/me",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    localStorage.removeItem("token");
                    setAuthenticated(false);
                    return;
                }

                setAuthenticated(true);

            } catch (error) {
                console.error(error);

                setAuthenticated(false);

            } finally {
                setLoading(false);
            }
        }

        verifyToken();
    }, []);

    if (loading) {
        return <p>Verificando acesso...</p>;
    }

    if (!authenticated) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;