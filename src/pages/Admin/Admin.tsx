import { useState } from "react";

import styles from "./Admin.module.css";
import Agendamentos from "./Agendamentos/Agendamentos";
import Dashboard from "./Dashboard/Dashboard";
import Servicos from "./Servicos/Servicos";
import Horarios from "./Horarios/Horarios";
import DatasBloqueadas from "./DatasBloqueadas/DatasBloqueadas";

type AdminSection =
    | "dashboard"
    | "appointments"
    | "services"
    | "businessHours"
    | "blockedDates";

function Admin() {

    const [section, setSection] =
        useState<AdminSection>("dashboard");

    function handleLogout() {
        localStorage.removeItem("token");

        window.location.href = "/admin";
    }

    return (
        <div className={styles.container}>

            <aside className={styles.sidebar}>
                <nav>

                    <button
                        type="button"
                        onClick={() =>
                            setSection("dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSection("appointments")
                        }
                    >
                        Agendamentos
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSection("services")
                        }
                    >
                        Serviços
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSection("businessHours")
                        }
                    >
                        Horários
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setSection("blockedDates")
                        }
                    >
                        Datas bloqueadas
                    </button>

                </nav>

                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Sair
                </button>

            </aside>

            <main className={styles.content}>

                {section === "dashboard" && (
                    <Dashboard />
                )}

                {section === "appointments" && (
                    <Agendamentos />
                )}

                {section === "services" && (
                    <Servicos />
                )}

                {section === "businessHours" && (
                    <Horarios />
                )}

                {section === "blockedDates" && (
                    <DatasBloqueadas />
                )}

            </main>

        </div>
    );
}

export default Admin;