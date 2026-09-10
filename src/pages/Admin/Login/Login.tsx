import { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Erro ao realizar login."
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/admin");

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao realizar login."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className={styles.container}>

            <form
                className={styles.form}
                onSubmit={handleLogin}
            >

                <h1>Login</h1>

                <div className={styles.field}>

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                </div>

                <div className={styles.field}>

                    <label htmlFor="password">
                        Senha
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                </div>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="darkBtn"
                    style={{width: "100%"}}
                >
                    {loading
                        ? "Entrando..."
                        : "Entrar"}
                </button>

            </form>

        </main>
    );
}

export default Login;