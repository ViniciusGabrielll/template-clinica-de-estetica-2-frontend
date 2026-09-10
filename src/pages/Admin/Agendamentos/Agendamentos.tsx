import { useEffect, useState } from "react";

import {
    getAppointments,
    updateAppointmentStatus,
    type Appointment
} from "../../../services/api";

import styles from "./Agendamentos.module.css";

function Agendamentos() {

    async function handleStatusChange(
        id: number,
        status: string
    ) {
        try {

            await updateAppointmentStatus(id, status);

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment.id === id
                        ? {
                            ...appointment,
                            status
                        }
                        : appointment
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao atualizar status."
            );
        }
    }

    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [dateFilter, setDateFilter] =
        useState<"all" | "specific">("all");

    const [selectedDate, setSelectedDate] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"all" | "scheduled" | "confirmed" | "cancelled">("all");

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
                        : "Erro ao carregar agendamentos."
                );

            } finally {

                setLoading(false);

            }
        }

        loadAppointments();

    }, []);

    if (loading) {
        return <p>Carregando agendamentos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (appointments.length === 0) {
        return <p>Nenhum agendamento encontrado.</p>;
    }

    const filteredAppointments = appointments.filter(
        (appointment) => {

            // FILTRO DE DATA
            if (dateFilter === "specific") {

                if (!selectedDate) {
                    return false;
                }

                const appointmentDate =
                    String(appointment.appointment_date)
                        .slice(0, 10);

                if (appointmentDate !== selectedDate) {
                    return false;
                }
            }

            // FILTRO DE STATUS
            if (statusFilter !== "all") {

                if (
                    appointment.status !== statusFilter
                ) {
                    return false;
                }
            }

            return true;
        }
    );

    return (
        <section className={styles.container}>

            <h2>Agendamentos</h2>

            <div className={styles.filters}>

                <div className={styles.filter}>

                    <label htmlFor="date-filter">
                        Data
                    </label>

                    <select
                        id="date-filter"
                        value={dateFilter}
                        onChange={(event) => {

                            const value =
                                event.target.value as
                                "all" | "specific";

                            setDateFilter(value);

                            if (value === "all") {
                                setSelectedDate("");
                            }

                        }}
                    >

                        <option value="all">
                            Todas as datas
                        </option>

                        <option value="specific">
                            Data específica
                        </option>

                    </select>

                </div>

                {dateFilter === "specific" && (

                    <div className={styles.filter}>

                        <label htmlFor="appointment-date">
                            Escolha uma data
                        </label>

                        <input
                            id="appointment-date"
                            type="date"
                            value={selectedDate}
                            onChange={(event) =>
                                setSelectedDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                )}

                {/* FILTRO DE STATUS */}

                <div className={styles.filter}>

                    <label htmlFor="status-filter">
                        Status
                    </label>

                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value as
                                "all" |
                                "scheduled" |
                                "confirmed" |
                                "cancelled"
                            )
                        }
                    >

                        <option value="all">
                            Todos
                        </option>

                        <option value="scheduled">
                            Na fila
                        </option>

                        <option value="confirmed">
                            Confirmados
                        </option>

                        <option value="cancelled">
                            Cancelados
                        </option>

                    </select>

                </div>

            </div>

            {filteredAppointments.length === 0 ? (

                <p>
                    Nenhum agendamento encontrado
                    com esses filtros.
                </p>

            ) : (

                <div className={styles.list}>

                    {filteredAppointments.map(
                        (appointment) => (

                            <section
                                key={appointment.id}
                                className={styles.card}
                            >

                                <div>

                                    <strong>
                                        {appointment.customer_name}
                                    </strong>

                                    <p>
                                        {appointment.customer_phone}
                                    </p>

                                </div>

                                <div>

                                    <strong>
                                        {appointment.service_name}
                                    </strong>

                                    <p>
                                        {appointment.duration}
                                        {" minutos"}
                                    </p>

                                </div>

                                <div>

                                    <strong>
                                        {appointment.start_time.slice(0, 5)}
                                        {" - "}
                                        {appointment.end_time.slice(0, 5)}
                                    </strong>

                                    <p>
                                        {String(
                                            appointment.appointment_date
                                        ).slice(0, 10)}
                                    </p>

                                </div>

                                <div className={styles.filter}>

                                    <select
                                        value={appointment.status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                appointment.id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="scheduled">
                                            Na fila
                                        </option>

                                        <option value="confirmed">
                                            Confirmado
                                        </option>

                                        <option value="cancelled">
                                            Cancelado
                                        </option>

                                    </select>
                                </div>
                            </section>

                        )
                    )}

                </div>

            )}

        </section>
    );
}

export default Agendamentos;