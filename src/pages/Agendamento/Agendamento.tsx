import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    getServices,
    getPromotions,
    getAvailableTimes,
    createAppointment,
    type Service,
    type Promotion
} from "../../services/api";

import styles from "./Agendamento.module.css";

function Agendamento() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [services, setServices] = useState<Service[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [customerName, setCustomerName] = useState<string>("");
    const [customerPhone, setCustomerPhone] = useState<string>("");
    const [creatingAppointment, setCreatingAppointment] = useState(false);

    const today = new Date()
        .toISOString()
        .split("T")[0];

    useEffect(() => {
        async function loadServices() {
            try {
                setLoading(true);

                const [servicesData, promotionsData] =
                    await Promise.all([
                        getServices(),
                        getPromotions()
                    ]);

                setServices(servicesData);
                setPromotions(promotionsData);
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

    useEffect(() => {
        const serviceId = searchParams.get("servico");

        if (!serviceId) {
            return;
        }

        const id = Number(serviceId);

        if (!services.some((service) => service.id === id)) {
            return;
        }

        setSelectedServices([id]);
    }, [searchParams, services]);

    function getPromotion(serviceId: number) {
        return promotions.find(
            (promotion) =>
                promotion.service_id === serviceId
        );
    }

    function getServicePrice(service: Service) {
        const promotion = getPromotion(service.id);

        if (promotion) {
            return Number(
                promotion.promotional_price
            );
        }

        return Number(service.price);
    }

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
        setValidationError("");
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
        setValidationError("");

        if (selectedServices.length === 0) {
            setValidationError(
                "Selecione pelo menos um serviço."
            );
            return;
        }

        if (!selectedDate) {
            setValidationError(
                "Selecione uma data."
            );
            return;
        }

        if (!selectedTime) {
            setValidationError(
                "Selecione um horário."
            );
            return;
        }

        if (!customerName.trim()) {
            setValidationError(
                "Informe seu nome."
            );
            return;
        }

        const phone = customerPhone.replace(/\D/g, "");

        if (phone.length < 10) {
            setValidationError(
                "Informe um telefone válido."
            );
            return;
        }

        try {
            setCreatingAppointment(true);

            await createAppointment({
                service_ids: selectedServices,
                customer_name: customerName.trim(),
                customer_phone: phone,
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

            setValidationError(
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
                total + getServicePrice(service),
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
            <div className={styles.cardsContainer}>
                <div
                    className={`${styles.service} ${styles.card}`}
                >
                    <div className={styles.cardTitle}>
                        <span className={styles.cardCount}>
                            1
                        </span>

                        <h2>
                            Tratamentos desejados
                        </h2>
                    </div>

                    <div className={styles.serviceList}>
                        {services.map((service) => {
                            const isSelected =
                                selectedServices.includes(
                                    service.id
                                );

                            const promotion =
                                getPromotion(service.id);

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
                                    <span>
                                        {service.name}
                                    </span>

                                    {promotion ? (
                                        <span
                                            className={
                                                styles.servicePrices
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.originalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.original_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>

                                            <strong
                                                className={
                                                    styles.promotionalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.promotional_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </strong>
                                        </span>
                                    ) : (
                                        <strong>
                                            {Number(
                                                service.price
                                            ).toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency:
                                                        "BRL"
                                                }
                                            )}
                                        </strong>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <p>
                        Selecionados:{" "}
                        {selectedServices.length}
                    </p>

                    {selectedServices.length > 0 && (
                        <div className={styles.total}>
                            <span>
                                Total
                            </span>

                            <strong>
                                {totalPrice.toLocaleString(
                                    "pt-BR",
                                    {
                                        style: "currency",
                                        currency: "BRL"
                                    }
                                )}
                            </strong>
                        </div>
                    )}
                </div>

                <div
                    className={`
                        ${styles.date}
                        ${styles.card}
                        ${selectedServices.length > 0
                            ? styles.active
                            : ""
                        }
                    `}
                >
                    <div className={styles.cardTitle}>
                        <span className={styles.cardCount}>
                            2
                        </span>

                        <h2>
                            Data desejada
                        </h2>
                    </div>

                    <div className={styles.datePicker}>
                        <DatePicker
                            selected={
                                selectedDate
                                    ? new Date(
                                        `${selectedDate}T00:00:00`
                                    )
                                    : null
                            }
                            onChange={(date: Date | null) => {
                                if (!date) {
                                    setSelectedDate("");
                                    setSelectedTime("");
                                    setValidationError("");
                                    return;
                                }

                                const formattedDate =
                                    date
                                        .toISOString()
                                        .split("T")[0];

                                setSelectedDate(
                                    formattedDate
                                );

                                setSelectedTime("");
                                setValidationError("");
                            }}
                            minDate={
                                new Date(
                                    `${today}T00:00:00`
                                )
                            }
                            inline
                            dateFormat="dd/MM/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                        />
                    </div>

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
                                                onClick={() => {
                                                    setSelectedTime(
                                                        time
                                                    );
                                                    setValidationError("");
                                                }}
                                                className={`
                                                    ${styles.time}
                                                    ${selectedTime === time
                                                        ? styles.active
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
                        </>
                    )}
                </div>

                <div
                    className={`
                        ${styles.customerData}
                        ${styles.card}
                        ${selectedTime.length > 0
                            ? styles.active
                            : ""
                        }
                    `}
                >
                    <div className={styles.cardTitle}>
                        <span className={styles.cardCount}>
                            3
                        </span>

                        <h2>
                            Informações
                        </h2>
                    </div>

                    <div
                        className={
                            styles.customerDataContent
                        }
                    >
                        <div
                            className={
                                styles.customerInputs
                            }
                        >
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={customerName}
                                onChange={(event) => {
                                    setCustomerName(
                                        event.target.value
                                    );
                                    setValidationError("");
                                }}
                                className={
                                    styles.customerInput
                                }
                            />

                            <div
                                className={
                                    styles.phoneInput
                                }
                            >
                                <span
                                    className={
                                        styles.phonePrefix
                                    }
                                >
                                    +55
                                </span>

                                <input
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    value={customerPhone}
                                    onChange={(event) => {
                                        let value =
                                            event.target.value.replace(
                                                /\D/g,
                                                ""
                                            );

                                        if (
                                            value.length > 11
                                        ) {
                                            value =
                                                value.slice(
                                                    0,
                                                    11
                                                );
                                        }

                                        if (
                                            value.length <= 10
                                        ) {
                                            value =
                                                value.replace(
                                                    /^(\d{2})(\d{4})(\d{0,4}).*/,
                                                    "($1) $2-$3"
                                                );
                                        } else {
                                            value =
                                                value.replace(
                                                    /^(\d{2})(\d{5})(\d{0,4}).*/,
                                                    "($1) $2-$3"
                                                );
                                        }

                                        setCustomerPhone(
                                            value
                                        );
                                        setValidationError("");
                                    }}
                                    className={
                                        styles.customerInput
                                    }
                                />
                            </div>
                        </div>

                        {validationError && (
                            <p
                                className={
                                    styles.validationError
                                }
                            >
                                {validationError}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={
                                handleCreateAppointment
                            }
                            disabled={
                                creatingAppointment
                            }
                            className={
                                styles.confirmBtn
                            }
                        >
                            {creatingAppointment
                                ? "Agendando..."
                                : "Agendar"}
                        </button>
                    </div>

                    <span>
                        Suas informações estarão seguras,
                        apenas serão usadas para confirmar
                        o agendamento.
                    </span>
                </div>
            </div>
        </main>
    );
}

export default Agendamento;