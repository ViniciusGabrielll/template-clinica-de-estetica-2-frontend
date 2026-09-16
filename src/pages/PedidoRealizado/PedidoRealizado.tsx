import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getPromotions,
    type Promotion
} from "../../services/api";

import styles from "./PedidoRealizado.module.css";

interface Service {
    id: number;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    active: boolean;
}

interface AppointmentData {
    customerName: string;
    customerPhone: string;
    selectedDate: string;
    selectedTime: string;
    services: Service[];
    totalDuration: number;
    totalPrice: number;
}

function PedidoRealizado() {
    const location = useLocation();
    const navigate = useNavigate();

    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const data =
        location.state as AppointmentData | null;

    useEffect(() => {
        async function loadPromotions() {
            try {
                const promotionsData =
                    await getPromotions();

                setPromotions(promotionsData);
            } catch (error) {
                console.error(error);
            }
        }

        loadPromotions();
    }, []);

    if (!data) {
        return (
            <main className={styles.container}>
                <h1>
                    Nenhum pedido encontrado
                </h1>

                <p>
                    Não foi possível encontrar os
                    dados do agendamento.
                </p>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/agendamento")
                    }
                    className={styles.backToHomeBtn}
                >
                    Fazer um agendamento
                </button>
            </main>
        );
    }

    const formattedDate =
        new Date(
            `${data.selectedDate}T12:00:00`
        ).toLocaleDateString("pt-BR");

    function getPromotion(serviceId: number) {
        return promotions.find(
            (promotion) =>
                promotion.service_id === serviceId
        );
    }

    return (
        <main className={styles.container}>
            <h1>
                Pedido realizado!
            </h1>

            <p>
                Seu agendamento foi realizado
                com sucesso.
            </p>

            <div className={styles.infoCard}>
                <div className={styles.customerInfo}>
                    <span>
                        Nome
                    </span>

                    <strong>
                        {data.customerName}
                    </strong>
                </div>

                <div className={styles.customerInfo}>
                    <span>
                        Data
                    </span>

                    <strong>
                        {formattedDate}
                    </strong>
                </div>

                <div className={styles.customerInfo}>
                    <span>
                        Horário
                    </span>

                    <strong>
                        {data.selectedTime}
                    </strong>
                </div>

                <div className={styles.servicesInfo}>
                    <span>
                        Serviços
                    </span>

                    <div className={styles.serviceList}>
                        {data.services.map(
                            (service) => {
                                const promotion =
                                    getPromotion(
                                        service.id
                                    );

                                return (
                                    <div
                                        key={service.id}
                                        className={
                                            styles.serviceItem
                                        }
                                    >
                                        <strong>
                                            {service.name}
                                        </strong>

                                        {promotion ? (
                                            <div
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
                                            </div>
                                        ) : (
                                            <span>
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
                                            </span>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className={styles.customerInfo}>
                    <span>
                        Duração
                    </span>

                    <strong>
                        {data.totalDuration} minutos
                    </strong>
                </div>

                <div className={styles.customerInfo}>
                    <span>
                        Total
                    </span>

                    <strong>
                        {data.totalPrice.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL"
                            }
                        )}
                    </strong>
                </div>
            </div>

            <p>
                Retornaremos pelo WhatsApp para
                confirmar o agendamento e fornecer
                mais informações.
            </p>

            <button
                type="button"
                onClick={() =>
                    navigate("/")
                }
                className="btn"
            >
                Voltar para o início
            </button>
        </main>
    );
}

export default PedidoRealizado;