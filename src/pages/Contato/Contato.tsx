import styles from "./Contato.module.css";

import whatsapp from "../../assets/icons/whatsapp.svg";
import instagram from "../../assets/icons/instagram.svg";
import businessHours from "../../assets/icons/businessHours.svg";
import maps from "../../assets/icons/maps.svg";

import { data } from "../../data/data";
import { useEffect, useState } from "react";
import { getServices, type Service } from "../../services/api";
import { FiArrowUpRight } from "react-icons/fi";
export default function Contato() {

    const [name, setName] = useState("");
    const [service, setService] = useState("");
    const [message, setMessage] = useState("");

    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        async function loadServices() {
            try {
                const data = await getServices();

                setServices(data);
            } catch (error) {
                console.error(error);

            }
        }

        loadServices();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !service) {
            alert("Por favor, preencha ao menos o nome e o serviço.");
            return;
        }

        const text = `Olá! Me chamo ${name} e gostaria de agendar o serviço: ${service}.${message ? `\n\nMensagem: ${message}` : ""
            }`;

        const url = `${data.whatsAppLink}&text=${encodeURIComponent(text)}`;

        window.open(url, "_blank");
    };


    return (
        <main className={styles.contact} id="contato">
            <section className={styles.contactSection}>
                <div className={styles.iframeContainer}>
                    <iframe className={styles.iframe} src={data.mapsLink} title="Localização da clínica no mapa" loading="lazy"></iframe>
                    <a className="redirect" href={data.mapsLink} target="_blank" rel="noopener noreferrer">localização <FiArrowUpRight /></a>
                </div>

                <div className={styles.contactContent}>
                    <a className={styles.contactCard} href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">
                        <img src={whatsapp} alt="Ícone do WhatsApp" />
                        <h2>{data.number}</h2>
                    </a>
                    <a className={styles.contactCard} href={data.instagramLink} target="_blank" rel="noopener noreferrer">
                        <img src={instagram} alt="Ícone do Instagram" />
                        <h2>@{data.instagram}</h2>
                    </a>
                    <div className={styles.contactCard}>
                        <img src={businessHours} alt="Ícone de Horário" />
                        <h2>{data.businessHours}</h2>
                    </div>
                    <div className={styles.contactCard}>
                        <img src={maps} alt="Ícone de Localização" />
                        <h2>{data.location}</h2>
                    </div>
                </div>


            </section>
        </main >
    )
}