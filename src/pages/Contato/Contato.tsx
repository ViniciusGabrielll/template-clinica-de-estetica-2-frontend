import styles from "./Contato.module.css";

import whatsapp from "../../assets/icons/whatsapp.svg";
import instagram from "../../assets/icons/instagram.svg";
import businessHours from "../../assets/icons/businessHours.svg";
import maps from "../../assets/icons/maps.svg";

import { data } from "../../data/data";
import { useEffect, useRef, useState } from "react";
import { getServices, type Service } from "../../services/api";
import { FiArrowUpRight } from "react-icons/fi";

export default function Contato() {

    const [services, setServices] = useState<Service[]>([]);

    const contactCardsRef = useRef<HTMLElement[]>([]);

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        contactCardsRef.current.forEach((card) => {
            if (card) {
                observer.observe(card);
            }
        });

        return () => observer.disconnect();
    }, [services]);

    return (
        <main className={styles.contact} id="contato">
            <section className={styles.contactSection}>
                <div className={styles.iframeContainer}>
                    <iframe
                        className={styles.iframe}
                        src={data.mapsIframe}
                        title="Localização da clínica no mapa"
                        loading="lazy"
                    ></iframe>

                    <a
                        className="redirect"
                        href={data.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        localização <FiArrowUpRight />
                    </a>
                </div>

                <div className={styles.contactContent}>
                    <a
                        className={`${styles.contactCard} reveal`}
                        href={data.whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        ref={(element) => {
                            if (element) {
                                contactCardsRef.current[0] = element;
                            }
                        }}
                        style={{ transitionDelay: "0s" }}
                    >
                        <img src={whatsapp} alt="Ícone do WhatsApp" />
                        <h2>{data.number}</h2>
                    </a>

                    <a
                        className={`${styles.contactCard} reveal`}
                        href={data.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        ref={(element) => {
                            if (element) {
                                contactCardsRef.current[1] = element;
                            }
                        }}
                        style={{ transitionDelay: "0.08s" }}
                    >
                        <img src={instagram} alt="Ícone do Instagram" />
                        <h2>@{data.instagram}</h2>
                    </a>

                    <div
                        className={`${styles.contactCard} reveal`}
                        ref={(element) => {
                            if (element) {
                                contactCardsRef.current[2] = element;
                            }
                        }}
                        style={{ transitionDelay: "0.16s" }}
                    >
                        <img src={businessHours} alt="Ícone de Horário" />
                        <h2>{data.businessHours}</h2>
                    </div>

                    <div
                        className={`${styles.contactCard} reveal`}
                        ref={(element) => {
                            if (element) {
                                contactCardsRef.current[3] = element;
                            }
                        }}
                        style={{ transitionDelay: "0.24s" }}
                    >
                        <img src={maps} alt="Ícone de Localização" />
                        <h2>{data.location}</h2>
                    </div>
                </div>
            </section>
        </main>
    );
}