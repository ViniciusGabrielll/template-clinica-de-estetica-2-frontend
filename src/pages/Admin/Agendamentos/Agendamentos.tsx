import { useEffect, useState } from "react";

import {
    getAppointments,
    updateAppointmentStatus,
    type Appointment
} from "../../../services/api";

import styles from "./Agendamentos.module.css";

type DateFilter = "all" | "specific";

type StatusFilter =
    | "all"
    | "scheduled"
    | "confirmed"
    | "cancelled";

function Agendamentos() {
    const [appointments, setAppointments] =
        useState<Appointment[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [dateFilter, setDateFilter] =
        useState<DateFilter>("all");

    const [selectedDate, setSelectedDate] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<StatusFilter>("all");

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

    useEffect(() => {
        async function loadAppointments() {
            try {
                setLoading(true);
                setError("");

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

    function getCurrentDateTime() {
        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        const hours = String(
            now.getHours()
        ).padStart(2, "0");

        const minutes = String(
            now.getMinutes()
        ).padStart(2, "0");

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    }

    function isAppointmentPast(
        appointment: Appointment
    ) {
        const current = getCurrentDateTime();

        const appointmentDate = String(
            appointment.appointment_date
        ).slice(0, 10);

        const appointmentTime = String(
            appointment.start_time
        ).slice(0, 5);

        if (appointmentDate < current.date) {
            return true;
        }

        if (appointmentDate > current.date) {
            return false;
        }

        return appointmentTime < current.time;
    }

    const filteredAppointments = appointments
        .filter((appointment) => {
            if (isAppointmentPast(appointment)) {
                return false;
            }

            if (statusFilter === "all") {
                if (appointment.status === "cancelled") {
                    return false;
                }
            } else {
                if (appointment.status !== statusFilter) {
                    return false;
                }
            }

            if (dateFilter === "specific") {
                if (!selectedDate) {
                    return false;
                }

                const appointmentDate = String(
                    appointment.appointment_date
                ).slice(0, 10);

                if (appointmentDate !== selectedDate) {
                    return false;
                }
            }

            return true;
        })
        .sort((a, b) => {
            const dateA = String(
                a.appointment_date
            ).slice(0, 10);

            const dateB = String(
                b.appointment_date
            ).slice(0, 10);

            const timeA = String(
                a.start_time
            ).slice(0, 5);

            const timeB = String(
                b.start_time
            ).slice(0, 5);

            return `${dateA}T${timeA}`.localeCompare(
                `${dateB}T${timeB}`
            );
        });

    if (loading) {
        return (
            <p>
                Carregando agendamentos...
            </p>
        );
    }

    if (error) {
        return (
            <p>
                {error}
            </p>
        );
    }

    return (
        <section className={styles.container}>
            <h2>
                Agendamentos
            </h2>

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
                                event.target.value as DateFilter;

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

                <div className={styles.filter}>
                    <label htmlFor="status-filter">
                        Status
                    </label>

                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value as StatusFilter
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