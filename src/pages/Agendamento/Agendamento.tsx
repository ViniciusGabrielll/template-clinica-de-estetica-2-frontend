import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getServices,
    getAvailableTimes,
    createAppointment,
    type Service
} from "../../services/api";

import styles from "./Agendamento.module.css";

function Agendamento() {
    const navigate = useNavigate();

    const [services, setServices] =
        useState<Service[]>([]);

    const [selectedServices, setSelectedServices] =
        useState<number[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedDate, setSelectedDate] =
        useState<string>("");

    const [availableTimes, setAvailableTimes] =
        useState<string[]>([]);

    const [loadingTimes, setLoadingTimes] =
        useState(false);

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const [selectedTime, setSelectedTime] =
        useState<string>("");

    const [customerName, setCustomerName] =
        useState<string>("");

    const [customerPhone, setCustomerPhone] =
        useState<string>("");

    const [creatingAppointment, setCreatingAppointment] =
        useState(false);


    useEffect(() => {
        async function loadServices() {
            try {
                setLoading(true);

                const data = await getServices();

                setServices(data);
            } catch (error) {
                console.error(error);

                setError(
                    "Não foi possível carregar os serviços."
                );
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    function toggleService(serviceId: number) {
        setSelectedServices((prev) => {
            if (prev.includes(serviceId)) {
                return prev.filter(
                    (id) => id !== serviceId
                );
            }

            return [...prev, serviceId];
        });

        setSelectedTime("");
    }

    useEffect(() => {
        async function loadAvailableTimes() {
            if (
                selectedServices.length === 0 ||
                !selectedDate
            ) {
                setAvailableTimes([]);
                return;
            }

            try {
                setLoadingTimes(true);

                const times = await getAvailableTimes(
                    selectedDate,
                    selectedServices
                );

                setAvailableTimes(times);
            } catch (error) {
                console.error(error);

                setAvailableTimes([]);
            } finally {
                setLoadingTimes(false);
            }
        }

        loadAvailableTimes();
    }, [selectedServices, selectedDate]);

    async function handleCreateAppointment() {
        if (selectedServices.length === 0) {
            return;
        }

        if (!selectedDate) {
            return;
        }

        if (!selectedTime) {
            return;
        }

        if (!customerName.trim()) {
            return;
        }

        if (!customerPhone.trim()) {
            return;
        }

        try {
            setCreatingAppointment(true);

            await createAppointment({
                service_ids: selectedServices,
                customer_name: customerName,
                customer_phone: customerPhone,
                appointment_date: selectedDate,
                start_time: selectedTime
            });

            navigate("/pedido-realizado", {
                state: {
                    customerName,
                    customerPhone,
                    selectedDate,
                    selectedTime,
                    services: selectedServiceObjects,
                    totalDuration,
                    totalPrice
                }
            });

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Não foi possível realizar o agendamento."
            );
        } finally {
            setCreatingAppointment(false);
        }
    }


    const selectedServiceObjects =
        services.filter(
            (service) =>
                selectedServices.includes(service.id)
        );


    const totalDuration =
        selectedServiceObjects.reduce(
            (total, service) =>
                total + Number(service.duration),
            0
        );

    const totalPrice =
        selectedServiceObjects.reduce(
            (total, service) =>
                total + Number(service.price),
            0
        );


    if (loading) {
        return <p>Carregando serviços...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


    return (
        <main className={styles.container}>

            <div className={styles.service}>

                <h2>Serviços</h2>

                <div className={styles.serviceList}>

                    {services.map((service) => {

                        const isSelected =
                            selectedServices.includes(
                                service.id
                            );

                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() =>
                                    toggleService(
                                        service.id
                                    )
                                }
                                className={`
                                    ${styles.serviceBtn}
                                    ${isSelected
                                        ? styles.active
                                        : ""
                                    }
                                `}
                            >

                                <strong>
                                    {service.name}
                                </strong>

                                <br />

                                <span>
                                    {service.description}
                                </span>

                                <br />

                                <span>
                                    Duração:{" "}
                                    {service.duration} minutos
                                </span>

                                <br />

                                <strong>
                                    R${" "}
                                    {Number(
                                        service.price
                                    ).toFixed(2)}
                                </strong>

                            </button>
                        );
                    })}

                </div>
                <p>Selecionados: {selectedServices.length}</p>
            </div>


            <div
                className={`
                    ${styles.data}
                    ${selectedServices.length > 0
                        ? styles.active
                        : ""
                    }
                `}
            >

                <h2>
                    Data de agendamento
                </h2>

                <input
                    type="date"
                    min={today}
                    value={selectedDate}
                    onChange={(event) => {
                        setSelectedDate(
                            event.target.value
                        );

                        setSelectedTime("");
                    }}
                    className={styles.dateInput}
                />


                {selectedDate && (
                    <>

                        <h3>
                            Horários disponíveis
                        </h3>


                        {loadingTimes ? (

                            <p>
                                Carregando horários...
                            </p>

                        ) : availableTimes.length === 0 ? (

                            <p>
                                Nenhum horário disponível
                                para essa data.
                            </p>

                        ) : (

                            <div
                                className={
                                    styles.timeList
                                }
                            >

                                {availableTimes.map(
                                    (time) => (

                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() =>
                                                setSelectedTime(
                                                    time
                                                )
                                            }
                                            className={`
                                                ${styles.time}
                                                ${selectedTime === time
                                                    ? styles.selectedTime
                                                    : ""
                                                }
                                            `}
                                        >
                                            {time}
                                        </button>

                                    )
                                )}

                            </div>
                        )}


                        {selectedTime && (

                            <div className={styles.customerData}>

                                <h3>
                                    Seus dados
                                </h3>

                                <div className={styles.customerInputs}>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={
                                            customerName
                                        }
                                        onChange={(event) =>
                                            setCustomerName(
                                                event.target.value
                                            )
                                        }

                                        className={styles.customerInput}
                                    />

                                    <input
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        value={customerPhone}
                                        onChange={(event) => {
                                            let value = event.target.value.replace(/\D/g, "");

                                            if (value.length > 11) {
                                                value = value.slice(0, 11);
                                            }

                                            if (value.length <= 10) {
                                                value = value.replace(
                                                    /^(\d{2})(\d{4})(\d{0,4}).*/,
                                                    "($1) $2-$3"
                                                );
                                            } else {
                                                value = value.replace(
                                                    /^(\d{2})(\d{5})(\d{0,4}).*/,
                                                    "($1) $2-$3"
                                                );
                                            }

                                            setCustomerPhone(value);
                                        }}
                                        className={styles.customerInput}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateAppointment
                                    }
                                    disabled={
                                        creatingAppointment
                                    }
                                    className={styles.confirmBtn}
                                >
                                    {creatingAppointment
                                        ? "Agendando..."
                                        : "Confirmar agendamento"}
                                </button>

                            </div>

                        )}

                    </>
                )}

            </div>

        </main>
    );
}

export default Agendamento;