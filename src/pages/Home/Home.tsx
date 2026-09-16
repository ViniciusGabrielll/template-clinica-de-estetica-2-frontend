import { data } from "../../data/data";

import styles from "./Home.module.css";

import { FaStar } from "react-icons/fa";

import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

function App() {
    return (
        <>

            <article className={styles.hero} id="inicio">
                <div className={styles.heroImg} style={{ backgroundImage: `url(${data.heroImg})` }}>
                    <Link to="agendamento" className="btn">Agendar <FiArrowUpRight /></Link>
                    <Link to="tratamentos" className="btn">Tratamentos <FiArrowUpRight /></Link>
                </div>
            </article>

            <article className={styles.treatments} id="tratamentos">
                <h2>Tratamentos em destaque</h2>
                <div className={styles.treatmentsGrid}>
                    <div className={styles.treatmentCard}></div>
                    <div className={styles.treatmentCard}></div>
                    <div className={styles.treatmentCard}></div>
                </div>
                <Link to="tratamentos" className="redirect">Ver todos <FiArrowUpRight /></Link>
            </article>

            <article className={styles.feedbacks}>
                <div className={styles.feedbacksImgContainer}>
                    <div className={styles.feedbacksImg} style={{ backgroundImage: `url(${data.feedbacksImg})` }}>
                        <div className={styles.stars}>
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                    </div>
                </div>
                <div className={styles.feedbacksGrid}>
                    {data.feedbacks.map((feedback) => (
                        <div className={styles.feedbackCard}>
                            <h3>{feedback.name}</h3>
                            <p>{feedback.comment}</p>
                            <a className={styles.feedbackLink} href={feedback.link} target="_blank" rel="noopener noreferrer" ><FiArrowUpRight /></a>
                        </div>
                    ))}
                </div>
            </article>

            <article className={styles.aboutUs} id="sobre">
                <h3 className={styles.aboutUsLabel}>Sobre nós</h3>
                <p>{data.textAboutUs}</p>
                <a className="redirect" href={data.mapsLink} target="_blank" rel="noopener noreferrer">localização <FiArrowUpRight /></a>
            </article>

        </>
    )
}

export default App
