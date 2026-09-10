import styles from "./Footer.module.css";

import { data } from "../../data/data";
import { FaHeart } from "react-icons/fa";



export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div>
                    <p>{data.textAboutUs}</p>
                </div>
                <div>
                    <h3>Links <br /> Rápidos —</h3>
                    <a href="#inicio">Início</a>
                    <a href="#sobre">Sobre</a>
                    <a href="#tratamentos">Tratamentos</a>
                    <a href="#contato">Contato</a>
                </div>
                <div>
                    <h3>Horário de<br /> Funcionamento —</h3>
                    <p>{data.businessHours}</p>
                </div>
                <div>
                    <h3>Fale <br />Conosco —</h3>
                    <a href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">{data.number}</a>
                    <a href={data.instagramLink} target="_blank" rel="noopener noreferrer">@{data.instagram}</a>
                </div>
            </div>
            <div className={styles.copywriting}>
                <img src={data.markBlack} alt="Logo" />
                <span>© 2026 {data.name}.<br /> Feito com <FaHeart /></span>
            </div>

        </footer >
    )
}