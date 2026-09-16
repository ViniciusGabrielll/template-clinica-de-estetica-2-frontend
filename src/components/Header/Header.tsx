import { data } from "../../data/data";
import styles from "./Header.module.css";

import whatsapp from "../../assets/icons/whatsapp.svg";
import instagram from "../../assets/icons/instagram.svg";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <NavLink to="/" onClick={closeMenu}>
                    <img className={styles.markHeader} src={data.mark} alt="Logo" />
                </NavLink>

                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                    <NavLink
                        to="/"
                        end
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/agendamento"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }
                    >
                        Agendar
                    </NavLink>

                    <NavLink
                        to="/tratamentos"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }
                    >
                        Tratamentos
                    </NavLink>

                    <NavLink
                        to="/contato"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                            isActive ? styles.active : ""
                        }
                    >
                        Contato
                    </NavLink>
                </nav>
            </div>

            <div className={styles.headerContact}>
                <a
                    href={data.whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={whatsapp} alt="Ícone do WhatsApp" />
                </a>

                <a
                    href={data.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={instagram} alt="Ícone do Instagram" />
                </a>

                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>
        </header>
    );
}