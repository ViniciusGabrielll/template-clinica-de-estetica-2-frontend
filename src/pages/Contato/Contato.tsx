import styles from "./Contato.module.css";

import whatsappPrimaryColor from "../../assets/icons/whatsappPrimaryColor.svg";
import instagramPrimaryColor from "../../assets/icons/instagramPrimaryColor.svg";
import businessHoursPrimaryColor from "../../assets/icons/businessHoursPrimaryColor.svg";
import mapsPrimaryColor from "../../assets/icons/mapsPrimaryColor.svg";

import modelo2 from "../../assets/images/modelo2.webp";
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
            <section className={styles.contactSection1}>
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
                <img className={styles.model} src={modelo2} alt="Modelo" />
            </section>

            <section className={styles.contactSection2}>
                <iframe className={styles.iframe} src={data.mapsLink} title="Localização da clínica no mapa" loading="lazy"></iframe>
                <div className={styles.contactContent}>
                    <h3>FALE CONOSCO</h3>
                    <h2>Saiba mais sobre nós</h2>
                    <p>Agende sua avaliação ou tire suas dúvidas. Nossa equipe está pronta para te atender com atenção e exclusividade.</p>
                    <div className={styles.contactCardContainer}>
                        <a className={styles.contactCard} href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">
                            <div className={styles.contactCardImgContainer}>
                                <img src={whatsappPrimaryColor} alt="Ícone do WhatsApp" />
                            </div>
                            <div className={styles.contactCardContent}>
                                <h5>Telefone / WhatsApp</h5>
                                <h4>{data.number}</h4>
                            </div>
                        </a>
                        <a className={styles.contactCard} href={data.instagramLink} target="_blank" rel="noopener noreferrer">
                            <div className={styles.contactCardImgContainer}>
                                <img src={instagramPrimaryColor} alt="Ícone do Instagram" />
                            </div>
                            <div className={styles.contactCardContent}>
                                <h5>Instagram</h5>
                                <h4>@{data.instagram}</h4>
                            </div>
                        </a>
                        <div className={styles.contactCard}>
                            <div className={styles.contactCardImgContainer}>
                                <img src={businessHoursPrimaryColor} alt="Ícone de Horário" />
                            </div>
                            <div className={styles.contactCardContent}>
                                <h5>Horário de Funcionamento</h5>
                                <h4>{data.businessHours}</h4>
                            </div>
                        </div>
                        <div className={styles.contactCard}>
                            <div className={styles.contactCardImgContainer}>
                                <img src={mapsPrimaryColor} alt="Ícone de Localização" />
                            </div>
                            <div className={styles.contactCardContent}>
                                <h5>Endereço</h5>
                                <h4>{data.location}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}