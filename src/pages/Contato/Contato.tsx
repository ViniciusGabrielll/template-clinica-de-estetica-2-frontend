import styles from "./Contato.module.css";

import whatsapp from "../../assets/icons/whatsapp.svg";
import instagram from "../../assets/icons/instagram.svg";
import businessHours from "../../assets/icons/businessHours.svg";
import maps from "../../assets/icons/maps.svg";

import { data } from "../../data/data";
import { useEffect, useState } from "react";
import { getServices, type Service } from "../../services/api";
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
            <section className={styles.iframeSection}>
                <iframe className={styles.iframe} src={data.mapsLink} title="Localização da clínica no mapa" loading="lazy"></iframe>
            </section>
            <section className={styles.contactSection}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h3>ENVIE UMA MENSAGEM VIA WHATSAPP</h3>

                    <input
                        type="text"
                        placeholder="Nome Completo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        name="servico"
                        id="servico"
                        required
                    >
                        <option value="" disabled>
                            Escolha um serviço
                        </option>
                        {services.map((s) => (
                            <option key={s.name} value={s.name}>
                                {s.name}
                            </option>
                        ))}
                        <option key="outro" value="outro">
                            Outro
                        </option>
                    </select>

                    <textarea
                        placeholder="Mensagem (opcional)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <button type="submit">Enviar</button>
                </form>
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