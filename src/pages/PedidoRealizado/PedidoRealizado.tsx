import { useLocation, useNavigate } from "react-router-dom";

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

    const data =
        location.state as AppointmentData | null;

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
        ).toLocaleDateString(
            "pt-BR"
        );

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


                <div className={styles.customerInfo}>
                    <span>
                        Serviços
                    </span>

                    <strong>
                        {data.services
                            .map(
                                (service) =>
                                    service.name
                            )
                            .join(", ")}
                    </strong>
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
                        R${" "}
                        {data.totalPrice.toFixed(
                            2
                        )}
                    </strong>
                </div>

            </div>


            <p>
               Retornaremos pelo WhatsApp para confirmar o agendamento e fornecer mais informações.
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