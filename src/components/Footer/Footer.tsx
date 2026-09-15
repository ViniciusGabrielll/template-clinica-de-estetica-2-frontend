import styles from "./Footer.module.css";

import { data } from "../../data/data";
import { Link } from "react-router-dom";



export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div>
                    <h3>Links <br /> Rápidos</h3>
                    <Link to="/">Home</Link>
                    <Link to="/agendamento">Agendar</Link>
                    <Link to="/tratamentos">Tratamentos</Link>
                    <Link to="/contato">Contato</Link>
                </div>
                <div>
                    <h3>Horário de<br /> Funcionamento</h3>
                    <p>{data.businessHours}</p>
                </div>
                <div>
                    <h3>Fale <br />Conosco</h3>
                    <a href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">{data.number}</a>
                    <a href={data.instagramLink} target="_blank" rel="noopener noreferrer">@{data.instagram}</a>
                </div>
                <iframe className={styles.iframe} src={data.mapsLink} title="Localização da clínica no mapa" loading="lazy"></iframe>
            </div>
            <div className={styles.copywriting}>
                <img src={data.mark} alt="Logo" />
                <div className={styles.copywritingContent}>
                    <span>© 2026 {data.name}. Todos os direitos reservados.</span>
                    <a href="https://vinigabriel.com/" target="_blank" rel="noopener noreferrer">Feito por Vinícius Gabriel</a>
                </div>
            </div>

        </footer >
    )
}