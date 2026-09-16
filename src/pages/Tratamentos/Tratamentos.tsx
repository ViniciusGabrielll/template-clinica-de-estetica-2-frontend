import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getServices,
    getPromotions,
    type Service,
    type Promotion
} from "../../services/api";

import styles from "./Tratamentos.module.css";

import { FiSearch, FiFilter } from "react-icons/fi";

export default function Tratamentos() {
    const [services, setServices] = useState<Service[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortPrice, setSortPrice] = useState("");
    const [promotionFilter, setPromotionFilter] = useState("");

    const [activeMinPrice, setActiveMinPrice] = useState("");
    const [activeMaxPrice, setActiveMaxPrice] = useState("");
    const [activeSortPrice, setActiveSortPrice] = useState("");
    const [activePromotionFilter, setActivePromotionFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadServices() {
            try {
                setLoading(true);

                const [servicesData, promotionsData] =
                    await Promise.all([
                        getServices(),
                        getPromotions()
                    ]);

                setServices(servicesData);
                setPromotions(promotionsData);
            } catch (error) {
                console.error(error);

                setError(
                    "Não foi possível carregar os serviços."
                );
            } finally {
                setLoading(false);
            }
        }

        loadServices();
    }, []);

    function handleFilter() {
        setActiveMinPrice(minPrice);
        setActiveMaxPrice(maxPrice);
        setActiveSortPrice(sortPrice);
        setActivePromotionFilter(promotionFilter);
    }

    function handleClearFilters() {
        setMinPrice("");
        setMaxPrice("");
        setSortPrice("");
        setPromotionFilter("");

        setActiveMinPrice("");
        setActiveMaxPrice("");
        setActiveSortPrice("");
        setActivePromotionFilter("");
    }

    function getPromotion(serviceId: number) {
        return promotions.find(
            (promotion) =>
                promotion.service_id === serviceId
        );
    }

    const filteredServices = services
        .filter((service) => {
            const matchesSearch = service.name
                .toLowerCase()
                .includes(search.toLowerCase().trim());

            const promotion = getPromotion(service.id);
            const hasPromotion = Boolean(promotion);

            const price = Number(service.price);

            const matchesMinPrice =
                !activeMinPrice ||
                price >= Number(activeMinPrice);

            const matchesMaxPrice =
                !activeMaxPrice ||
                price <= Number(activeMaxPrice);

            const matchesPromotion =
                !activePromotionFilter ||
                (activePromotionFilter === "with" &&
                    hasPromotion) ||
                (activePromotionFilter === "without" &&
                    !hasPromotion);

            return (
                matchesSearch &&
                matchesMinPrice &&
                matchesMaxPrice &&
                matchesPromotion
            );
        })
        .sort((a, b) => {
            if (activeSortPrice === "asc") {
                return Number(a.price) - Number(b.price);
            }

            if (activeSortPrice === "desc") {
                return Number(b.price) - Number(a.price);
            }

            return 0;
        });

    if (loading) {
        return (
            <main
                className={styles.services}
                id="tratamentos"
            >
                <p>Carregando serviços...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main
                className={styles.services}
                id="tratamentos"
            >
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main
            className={styles.services}
            id="tratamentos"
        >
            <div className={styles.searchContainer}>
                <div className={styles.searchInput}>
                    <FiSearch size={20} />

                    <input
                        type="text"
                        placeholder="Pesquisar serviços..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowFilters((prev) => !prev)
                    }
                    className={styles.filter}
                >
                    <FiFilter />
                    {showFilters ? "Fechar" : "Filtrar"}
                </button>
            </div>

            {showFilters && (
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>
                            Preço mínimo
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="R$ 0"
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>
                            Preço máximo
                        </label>

                        <input
                            type="number"
                            min="0"
                            placeholder="R$ 0"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className={styles.filterGroup}>
                        <label>
                            Ordenar por preço
                        </label>

                        <select
                            value={sortPrice}
                            onChange={(event) =>
                                setSortPrice(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Padrão
                            </option>

                            <option value="asc">
                                Menor preço
                            </option>

                            <option value="desc">
                                Maior preço
                            </option>
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>
                            Promoção
                        </label>

                        <select
                            value={promotionFilter}
                            onChange={(event) =>
                                setPromotionFilter(
                                    event.target.value
                                )
                            }
                        >
                            <option value="">
                                Todos
                            </option>

                            <option value="with">
                                Com promoção
                            </option>

                            <option value="without">
                                Sem promoção
                            </option>
                        </select>
                    </div>

                    <div className={styles.filterActions}>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClearFilters}
                        >
                            Limpar
                        </button>

                        <button
                            type="button"
                            onClick={handleFilter}
                            className="btn"
                        >
                            Aplicar filtros
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.serviceList}>
                {filteredServices.length > 0 ? (
                    filteredServices.map((service) => {
                        const promotion = getPromotion(
                            service.id
                        );

                        return (
                            <Link
                                to={`/agendamento?servico=${service.id}`}
                                className={styles.serviceCard}
                                key={service.id}
                                style={{
                                    backgroundImage: `url(${service.image_url})`
                                }}
                            >
                                <h3>
                                    {service.name}
                                </h3>

                                <p>
                                    {service.description}
                                </p>

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
                                                    currency: "BRL"
                                                }
                                            )}
                                        </span>

                                        <strong
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
                                                    currency: "BRL"
                                                }
                                            )}
                                        </strong>
                                    </div>
                                ) : (
                                    <strong>
                                        {Number(
                                            service.price
                                        ).toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL"
                                            }
                                        )}
                                    </strong>
                                )}
                            </Link>
                        );
                    })
                ) : (
                    <p>
                        Nenhum serviço encontrado.
                    </p>
                )}
            </div>
        </main>
    );
}