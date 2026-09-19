import { useEffect, useState } from "react";

import {
    getAppointments,
    updateAppointmentStatus,
    type Appointment
} from "../../../services/api";

import styles from "./Agendamentos.module.css";
import { FiArrowUpRight } from "react-icons/fi";

type DateFilter = "all" | "specific";

type StatusFilter =
    | "all"
    | "scheduled"
    | "confirmed"
    | "cancelled";

type AppointmentStatus =
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
        status: AppointmentStatus
    ) {
        try {
            await updateAppointmentStatus(id, status);

            if (status === "cancelled") {
                setAppointments((currentAppointments) =>
                    currentAppointments.filter(
                        (appointment) =>
                            appointment.id !== id
                    )
                );

                return;
            }

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
                        (appointment) => {
                            const originalPrice =
                                Number(
                                    appointment.original_total_price ?? 0
                                );

                            const totalPrice =
                                Number(
                                    appointment.total_price ?? 0
                                );

                            const hasPromotion =
                                originalPrice > totalPrice &&
                                totalPrice > 0;

                            const whatsappPhone = String(
                                appointment.customer_phone
                            ).replace(/\D/g, "");

                            const whatsappMessage = encodeURIComponent(
                                `Olá, ${appointment.customer_name}! Seu agendamento para ${appointment.service_name} no dia ${String(
                                    appointment.appointment_date
                                ).slice(0, 10)} às ${String(
                                    appointment.start_time
                                ).slice(0, 5)} está confirmado.`
                            );

                            const whatsappUrl = `https://wa.me/55${whatsappPhone}?text=${whatsappMessage}`;

                            return (
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
                                        <strong
                                            className={
                                                hasPromotion
                                                    ? styles.promotionalPrice
                                                    : undefined
                                            }
                                        >
                                            {hasPromotion && (
                                                <span
                                                    className={
                                                        styles.originalPrice
                                                    }
                                                >
                                                    {originalPrice.toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL"
                                                        }
                                                    )}
                                                </span>
                                            )}

                                            {totalPrice.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL"
                                                }
                                            )}
                                        </strong>

                                        <p>
                                            {String(
                                                appointment.start_time
                                            ).slice(0, 5)}
                                            {" - "}
                                            {String(
                                                appointment.end_time
                                            ).slice(0, 5)}
                                        </p>
                                    </div>

                                    <div>
                                        <strong>
                                            {String(
                                                appointment.appointment_date
                                            ).slice(0, 10)}
                                        </strong>
                                    </div>

                                    <div className={styles.confirmContainer}>
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="redirect"
                                        >
                                            
                                            Confirmar pelo WhatsApp
                                            <FiArrowUpRight/>
                                        </a>

                                        <div className={styles.filter}>
                                            <select
                                                value={appointment.status}
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        appointment.id,
                                                        event.target.value as AppointmentStatus
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
                                    </div>

                                </section>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}

export default Agendamentos;