import { data } from "../../data/data";
import styles from "./Header.module.css";

import whatsappBlack from "../../assets/icons/whatsappBlack.svg";
import instagramBlack from "../../assets/icons/instagramBlack.svg";
import { NavLink } from "react-router-dom";



export default function Header() {
    return (
        <div className={styles.header}>
            <img className={styles.markHeader} src={data.markBlack} alt="Logo" />
            <nav className={styles.nav}>
                        <NavLink to="/" end className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }>Home</NavLink>
                        <NavLink to="/agendamento" className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }>Agendar</NavLink>
                        <NavLink to="/tratamentos" className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }>Tratamentos</NavLink>
                        <NavLink to="/contato" className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }>Contato</NavLink>
            </nav>
            <a className={styles.whatsAppHeader} href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">
                <img src={whatsappBlack} alt="Ícone do WhatsApp" />
            </a>
            <a className={styles.instagramHeader} href={data.instagramLink} target="_blank" rel="noopener noreferrer">
                <img src={instagramBlack} alt="Ícone do Instagram" />
            </a>
        </div>
    )
}
