import { data } from "../../data/data";

import styles from "./Home.module.css";

import { FaStar, FaArrowRight } from "react-icons/fa";

import whatsappBlack from "../../assets/icons/whatsappBlack.svg";
import instagramBlack from "../../assets/icons/instagramBlack.svg";
import modelo1 from "../../assets/images/modelo1.webp";



import { Link } from "react-router-dom";

function App() {
    return (
        <>

            <article className={styles.hero} id="inicio">
                <div>
                    <h1>{data.name}</h1>
                    <h2>A maior clínica de estética do {data.city}</h2>
                </div>
                <div className={styles.heroBtns}>
                    <Link to="agendamento" className="darkBtn">
                        Agendar Tratamento
                    </Link>
                    <Link to="tratamentos" className="lightBtn">Ver Tratamentos</Link>
                </div>

                <div className={styles.heroLinks}>
                    <a href={data.whatsAppLink} target="_blank" rel="noopener noreferrer">
                        <img src={whatsappBlack} alt="Ícone do WhatsApp" />
                    </a>
                    <a href={data.instagramLink} target="_blank" rel="noopener noreferrer">
                        <img src={instagramBlack} alt="Ícone do Instagram" />
                    </a>
                </div>

                <img src={modelo1} alt="Modelo" className={styles.model} />
            </article>

            <div className={styles.sectionSeparator} />

            <article className={styles.aboutUs} id="sobre">
                <img src={data.aboutUsImg} alt="Foto da clínica de estética" />
                <div className={styles.aboutUsContent}>
                    <div>
                        <h3 className={styles.articleLabel}>SOBRE NÓS</h3>
                        <h2>Sua beleza, nosso cuidado</h2>
                    </div>
                    <p>{data.textAboutUs}</p>
                    <div>
                        <a href="#contato" className="lightBtn">Fale conosco</a>
                    </div>
                </div>
                <div className={styles.differentials}>
                    <div className={styles.differential}>
                        <h4>{data.differential1Title}</h4>
                        <p>{data.differential1Description}</p>
                    </div>
                    <div className={styles.differential}>
                        <h4>{data.differential2Title}</h4>
                        <p>{data.differential2Description}</p>
                    </div>
                    <div className={styles.differential}>
                        <h4>{data.differential3Title}</h4>
                        <p>{data.differential3Description}</p>
                    </div>
                </div>
            </article>

            <article className={styles.feedbacks}>
                {data.feedbacks.map((feedback) => (
                    <div className={styles.feedbackCard}>
                        <span className={styles.quotationFeedback}>"</span>
                        <h3>{feedback.name}</h3>
                        <span className={styles.feedbackStars}>{feedback.stars} <FaStar /></span>
                        <p>{feedback.comment}</p>
                        <a className={styles.feedbackLink} href={feedback.link} target="_blank" rel="noopener noreferrer" >Ver Feedback <FaArrowRight /></a>
                    </div>
                ))}
            </article>
        </>
    )
}

export default App
