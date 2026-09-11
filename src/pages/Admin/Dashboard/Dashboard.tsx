import { useEffect, useState } from "react";

import {
    getAppointments,
    type Appointment
} from "../../../services/api";

import styles from "./Dashboard.module.css";

function Dashboard() {

    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        async function loadAppointments() {

            try {

                setLoading(true);

                const data = await getAppointments();

                setAppointments(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Erro ao carregar dashboard."
                );

            } finally {

                setLoading(false);

            }
        }

        loadAppointments();

    }, []);

    if (loading) {
        return (
            <section className={styles.container}>
                <p>Carregando dashboard...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.container}>
                <p>{error}</p>
            </section>
        );
    }

    // DATA DE HOJE
    const today = new Date()
        .toISOString()
        .slice(0, 10);

    // AGENDAMENTOS DE HOJE
    const todayAppointments =
        appointments.filter(
            (appointment) =>
                String(appointment.appointment_date)
                    .slice(0, 10) === today
        );

    // STATUS
    const scheduled =
        appointments.filter(
            (appointment) =>
                appointment.status === "scheduled"
        ).length;

    const confirmed =
        appointments.filter(
            (appointment) =>
                appointment.status === "confirmed"
        ).length;

    const completed =
        appointments.filter(
            (appointment) =>
                appointment.status === "completed"
        ).length;

    const cancelled =
        appointments.filter(
            (appointment) =>
                appointment.status === "cancelled"
        ).length;

    // PRÓXIMOS AGENDAMENTOS
    const upcomingAppointments =
        appointments
            .filter(
                (appointment) =>
                    appointment.status !== "cancelled" &&
                    String(appointment.appointment_date)
                        .slice(0, 10) >= today
            )
            .sort((a, b) => {

                const dateA =
                    `${String(a.appointment_date).slice(0, 10)} ${a.start_time}`;

                const dateB =
                    `${String(b.appointment_date).slice(0, 10)} ${b.start_time}`;

                return dateA.localeCompare(dateB);

            })
            .slice(0, 5);

    return (
        <section className={styles.container}>

            <div className={styles.header}>

                <div>

                    <h2>Dashboard</h2>

                    <p>
                        Resumo dos seus agendamentos.
                    </p>

                </div>

            </div>

            <div className={styles.cards}>

                <div className={styles.card}>

                    <span>
                        Hoje
                    </span>

                    <strong>
                        {todayAppointments.length}
                    </strong>

                    <p>
                        agendamentos
                    </p>

                </div>

                <div className={styles.card}>

                    <span>
                        Na fila
                    </span>

                    <strong>
                        {scheduled}
                    </strong>

                    <p>
                        agendamentos
                    </p>

                </div>

                <div className={styles.card}>

                    <span>
                        Confirmados
                    </span>

                    <strong>
                        {confirmed}
                    </strong>

                    <p>
                        agendamentos
                    </p>

                </div>

                <div className={styles.card}>

                    <span>
                        Cancelados
                    </span>

                    <strong>
                        {cancelled}
                    </strong>

                    <p>
                        agendamentos
                    </p>

                </div>

            </div>

            <div className={styles.upcoming}>

                <div className={styles.sectionHeader}>

                    <h3>
                        Próximos agendamentos
                    </h3>

                </div>

                {upcomingAppointments.length === 0 ? (

                    <p className={styles.empty}>
                        Nenhum próximo agendamento.
                    </p>

                ) : (

                    <div className={styles.appointments}>

                        {upcomingAppointments.map(
                            (appointment) => (

                                <div
                                    key={appointment.id}
                                    className={styles.appointment}
                                >

                                    <div className={styles.time}>

                                        <strong>
                                            {appointment.start_time.slice(0, 5)}
                                        </strong>

                                        <span>
                                            {String(
                                                appointment.appointment_date
                                            ).slice(0, 10)}
                                        </span>

                                    </div>

                                    <div className={styles.info}>

                                        <strong>
                                            {appointment.customer_name}
                                        </strong>

                                        <span>
                                            {appointment.service_name}
                                        </span>

                                    </div>

                                    <div className={styles.status}>

                                        {appointment.status === "scheduled" &&
                                            "Na fila"}

                                        {appointment.status === "confirmed" &&
                                            "Confirmado"}

                                        {appointment.status === "completed" &&
                                            "Concluído"}

                                        {appointment.status === "cancelled" &&
                                            "Cancelado"}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}

export default Dashboard;