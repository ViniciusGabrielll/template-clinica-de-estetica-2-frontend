import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { data } from "../../data/data";
import styles from "./Home.module.css";

import { FaStar } from "react-icons/fa";
import {
    FiArrowLeft,
    FiArrowRight,
    FiArrowUpRight
} from "react-icons/fi";

import {
    getFeaturedServices,
    getPromotions,
    type Service,
    type Promotion
} from "../../services/api";

import modelo from "../../assets/images/modelo.webp";

export default function Home() {
    const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const [
        canPromotionScrollLeft,
        setCanPromotionScrollLeft
    ] = useState(false);

    const [
        canPromotionScrollRight,
        setCanPromotionScrollRight
    ] = useState(false);

    const treatmentsRef = useRef<HTMLDivElement>(null);
    const promotionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [
                    featuredServicesData,
                    promotionsData
                ] = await Promise.all([
                    getFeaturedServices(),
                    getPromotions()
                ]);

                setFeaturedServices(featuredServicesData);
                setPromotions(promotionsData);
            } catch (error) {
                console.error(error);
            }
        }

        loadData();
    }, []);

    function getPromotion(serviceId: number) {
        return promotions.find(
            (promotion) =>
                promotion.service_id === serviceId
        );
    }

    function updateScrollButtons() {
        const container = treatmentsRef.current;

        if (!container) {
            return;
        }

        setCanScrollLeft(container.scrollLeft > 0);

        setCanScrollRight(
            container.scrollLeft + container.clientWidth <
            container.scrollWidth - 1
        );
    }

    function updatePromotionScrollButtons() {
        const container = promotionsRef.current;

        if (!container) {
            return;
        }

        setCanPromotionScrollLeft(
            container.scrollLeft > 0
        );

        setCanPromotionScrollRight(
            container.scrollLeft + container.clientWidth <
            container.scrollWidth - 1
        );
    }

    useEffect(() => {
        updateScrollButtons();
        updatePromotionScrollButtons();

        const treatmentsContainer = treatmentsRef.current;
        const promotionsContainer = promotionsRef.current;

        if (treatmentsContainer) {
            treatmentsContainer.addEventListener(
                "scroll",
                updateScrollButtons
            );
        }

        if (promotionsContainer) {
            promotionsContainer.addEventListener(
                "scroll",
                updatePromotionScrollButtons
            );
        }

        window.addEventListener(
            "resize",
            updateScrollButtons
        );

        window.addEventListener(
            "resize",
            updatePromotionScrollButtons
        );

        return () => {
            if (treatmentsContainer) {
                treatmentsContainer.removeEventListener(
                    "scroll",
                    updateScrollButtons
                );
            }

            if (promotionsContainer) {
                promotionsContainer.removeEventListener(
                    "scroll",
                    updatePromotionScrollButtons
                );
            }

            window.removeEventListener(
                "resize",
                updateScrollButtons
            );

            window.removeEventListener(
                "resize",
                updatePromotionScrollButtons
            );
        };
    }, [featuredServices, promotions]);

    function scrollTreatments(
        direction: "left" | "right"
    ) {
        const container = treatmentsRef.current;

        if (!container) {
            return;
        }

        const card = container.querySelector(
            `.${styles.treatmentCard}`
        ) as HTMLElement | null;

        if (!card) {
            return;
        }

        const amount = card.offsetWidth + 16;

        container.scrollBy({
            left:
                direction === "right"
                    ? amount
                    : -amount,
            behavior: "smooth"
        });
    }

    function scrollPromotions(
        direction: "left" | "right"
    ) {
        const container = promotionsRef.current;

        if (!container) {
            return;
        }

        const card = container.querySelector(
            `.${styles.treatmentCard}`
        ) as HTMLElement | null;

        if (!card) {
            return;
        }

        const amount = card.offsetWidth + 16;

        container.scrollBy({
            left:
                direction === "right"
                    ? amount
                    : -amount,
            behavior: "smooth"
        });
    }

    return (
        <>
            <article
                className={styles.hero}
                id="inicio"
            >
                <div
                    className={styles.heroDiv}
                >
                    <h1 className={styles.heroTitle}>{data.name}</h1>
                    <img src={modelo} className={styles.heroImg} />
                    <Link
                        to="agendamento"
                        className="btn"
                    >
                        Agendar <FiArrowUpRight />
                    </Link>

                    <Link
                        to="tratamentos"
                        className="btn"
                    >
                        Tratamentos <FiArrowUpRight />
                    </Link>
                </div>
            </article>

            {promotions.length > 0 && (
                <article
                    className={styles.treatments}
                >
                    <div
                        className={
                            styles.treatmentsHeader
                        }
                    >
                        <h2>
                            Tratamentos em promoção
                        </h2>

                        {(canPromotionScrollLeft ||
                            canPromotionScrollRight) && (
                                <div
                                    className={
                                        styles.treatmentsButtons
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollPromotions(
                                                "left"
                                            )
                                        }
                                        disabled={
                                            !canPromotionScrollLeft
                                        }
                                        aria-label="Promoção anterior"
                                    >
                                        <FiArrowLeft />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            scrollPromotions(
                                                "right"
                                            )
                                        }
                                        disabled={
                                            !canPromotionScrollRight
                                        }
                                        aria-label="Próxima promoção"
                                    >
                                        <FiArrowRight />
                                    </button>
                                </div>
                            )}
                    </div>

                    <div
                        className={
                            styles.treatmentsGrid
                        }
                        ref={promotionsRef}
                    >
                        {promotions.map(
                            (promotion) => (
                                <Link
                                    to={`/agendamento?servico=${promotion.service_id}`}
                                    key={promotion.id}
                                    className={
                                        styles.treatmentCard
                                    }
                                >
                                    {promotion.service_image && (
                                        <div
                                            className={
                                                styles.treatmentImage
                                            }
                                            style={{
                                                backgroundImage: `url(${promotion.service_image})`
                                            }}
                                        />
                                    )}

                                    <div
                                        className={
                                            styles.treatmentInfo
                                        }
                                    >
                                        <h3>
                                            {
                                                promotion.service_name
                                            }
                                        </h3>

                                        <div
                                            className={
                                                styles.promotionPrices
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.originalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.original_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>

                                            <span
                                                className={
                                                    styles.promotionalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.promotional_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>

                    <Link
                        to="tratamentos"
                        className="redirect"
                    >
                        Ver todos <FiArrowUpRight />
                    </Link>
                </article>
            )}

            <article
                className={styles.treatments}
                id="tratamentos"
            >
                <div className={styles.treatmentsHeader}>
                    <h2>
                        Tratamentos em destaque
                    </h2>

                    {(canScrollLeft ||
                        canScrollRight) && (
                            <div
                                className={
                                    styles.treatmentsButtons
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        scrollTreatments(
                                            "left"
                                        )
                                    }
                                    disabled={
                                        !canScrollLeft
                                    }
                                    aria-label="Tratamento anterior"
                                >
                                    <FiArrowLeft />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        scrollTreatments(
                                            "right"
                                        )
                                    }
                                    disabled={
                                        !canScrollRight
                                    }
                                    aria-label="Próximo tratamento"
                                >
                                    <FiArrowRight />
                                </button>
                            </div>
                        )}
                </div>

                <div
                    className={styles.treatmentsGrid}
                    ref={treatmentsRef}
                >
                    {featuredServices.map((service) => {
                        const promotion =
                            getPromotion(service.id);

                        return (
                            <Link
                                to={`/agendamento?servico=${service.id}`}
                                key={service.id}
                                className={
                                    styles.treatmentCard
                                }
                            >
                                {service.image_url && (
                                    <div
                                        className={
                                            styles.treatmentImage
                                        }
                                        style={{
                                            backgroundImage: `url(${service.image_url})`
                                        }}
                                    />
                                )}

                                <div
                                    className={
                                        styles.treatmentInfo
                                    }
                                >
                                    <h3>
                                        {service.name}
                                    </h3>

                                    {service.description && (
                                        <p>
                                            {
                                                service.description
                                            }
                                        </p>
                                    )}

                                    {promotion ? (
                                        <div
                                            className={
                                                styles.promotionPrices
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.originalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.original_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>

                                            <span
                                                className={
                                                    styles.promotionalPrice
                                                }
                                            >
                                                {Number(
                                                    promotion.promotional_price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                styles.treatmentDetails
                                            }
                                        >
                                            <span>
                                                {
                                                    service.duration
                                                }{" "}
                                                min
                                            </span>

                                            <span>
                                                {Number(
                                                    service.price
                                                ).toLocaleString(
                                                    "pt-BR",
                                                    {
                                                        style: "currency",
                                                        currency:
                                                            "BRL"
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <Link
                    to="tratamentos"
                    className="redirect"
                >
                    Ver todos <FiArrowUpRight />
                </Link>
            </article>

            <article className={styles.feedbacks}>
                <div
                    className={
                        styles.feedbacksImgContainer
                    }
                >
                    <div
                        className={styles.feedbacksImg}
                        style={{
                            backgroundImage: `url(${data.feedbacksImg})`
                        }}
                    >
                        <div
                            className={styles.stars}
                        >
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                    </div>
                </div>

                <div
                    className={styles.feedbacksGrid}
                >
                    {data.feedbacks.map(
                        (feedback) => (
                            <div
                                className={
                                    styles.feedbackCard
                                }
                                key={feedback.name}
                            >
                                <h3>
                                    {feedback.name}
                                </h3>

                                <p>
                                    {
                                        feedback.comment
                                    }
                                </p>

                                <a
                                    className={
                                        styles.feedbackLink
                                    }
                                    href={
                                        feedback.link
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FiArrowUpRight />
                                </a>
                            </div>
                        )
                    )}
                </div>
            </article>

            <article
                className={styles.aboutUs}
                id="sobre"
            >
                <h3
                    className={
                        styles.aboutUsLabel
                    }
                >
                    Sobre nós
                </h3>

                <p>{data.textAboutUs}</p>

                <a
                    className="redirect"
                    href={data.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    localização <FiArrowUpRight />
                </a>
            </article>
        </>
    );
}