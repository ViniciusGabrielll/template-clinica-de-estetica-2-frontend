import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

import { getServices, type Service } from "../../services/api";

import styles from "./Tratamentos.module.css";

export default function Tratamentos() {
    const [services, setServices] = useState<Service[]>([]);
    const [showAll, setShowAll] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const visibleServices = showAll
        ? services
        : services.slice(0, 8);

    if (loading) {
        return (
            <main className={styles.services} id="tratamentos">
                <p>Carregando serviços...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className={styles.services} id="tratamentos">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className={styles.services} id="tratamentos">

            <input type="text" placeholder="Pesquisar serviços..." />
            <button>Filtrar</button>
            <div className={styles.serviceList}>

                {visibleServices.map((service) => (

                    <Link
                        to="/agendamento"
                        className={styles.serviceCard}
                        key={service.id}
                    >
                        <h3>{service.name}</h3>

                        <p>{service.description}</p>

                        <strong>    {Number(service.price).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}</strong>
                    </Link>

                ))}

                {services.length > 8 && !showAll && (
                    <div className={styles.servicesGradient} />
                )}

            </div>

            {services.length > 8 && (
                <button
                    className="darkBtn"
                    onClick={() =>
                        setShowAll((prev) => !prev)
                    }
                >
                    <FaChevronDown
                        size={18}
                        style={{
                            transform: showAll
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            transition: "transform 0.2s",
                            fill: "white"
                        }}
                    />

                    {showAll ? "Ver Menos" : "Ver Todos"}
                </button>
            )}

        </main>
    );
}