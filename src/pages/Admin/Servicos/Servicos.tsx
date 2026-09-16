import { useEffect, useState } from "react";

import {
    getServices,
    createService,
    updateService,
    deleteService,
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    type Service,
    type Promotion
} from "../../../services/api";

import styles from "./Servicos.module.css";

type FormData = {
    name: string;
    description: string;
    duration: string;
    price: string;
    image: File | null;
    featured: boolean;
};

type PromotionFormData = {
    promotional_price: string;
    expires_at: string;
};

const initialForm: FormData = {
    name: "",
    description: "",
    duration: "",
    price: "",
    image: null,
    featured: false
};

const initialPromotionForm: PromotionFormData = {
    promotional_price: "",
    expires_at: ""
};

function Servicos() {
    const [services, setServices] = useState<Service[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState<FormData>(initialForm);
    const [promotionForm, setPromotionForm] =
        useState<PromotionFormData>(initialPromotionForm);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [promotionServiceId, setPromotionServiceId] =
        useState<number | null>(null);

    const [editingPromotionId, setEditingPromotionId] =
        useState<number | null>(null);

    const [saving, setSaving] = useState(false);
    const [savingPromotion, setSavingPromotion] =
        useState(false);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    async function loadData() {
        try {
            setLoading(true);
            setError("");

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
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar serviços."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    function handlePromotionChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target;

        setPromotionForm((current) => ({
            ...current,
            [name]: value
        }));
    }

    function handleImageChange(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Selecione uma imagem válida.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("A imagem deve ter no máximo 5 MB.");
            return;
        }

        setForm((current) => ({
            ...current,
            image: file
        }));

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
    }

    function handleEdit(service: Service) {
        setEditingId(service.id);

        setForm({
            name: service.name,
            description: service.description || "",
            duration: String(service.duration),
            price: String(service.price),
            image: null,
            featured: service.featured
        });

        setImagePreview(service.image_url || null);
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm(initialForm);
        setImagePreview(null);
    }

    async function handleSubmit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        try {
            setSaving(true);

            const duration = Number(form.duration);
            const price = Number(form.price);

            if (!form.name.trim()) {
                alert("Informe o nome do serviço.");
                return;
            }

            if (!duration || duration <= 0) {
                alert("Informe uma duração válida.");
                return;
            }

            if (price < 0 || Number.isNaN(price)) {
                alert("Informe um preço válido.");
                return;
            }

            const data = {
                name: form.name.trim(),
                description: form.description.trim(),
                duration,
                price,
                image: form.image,
                featured: form.featured
            };

            if (editingId !== null) {
                await updateService(editingId, data);
            } else {
                await createService(data);
            }

            setForm(initialForm);
            setEditingId(null);
            setImagePreview(null);

            await loadData();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar serviço."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleFeatured(service: Service) {
        try {
            await updateService(service.id, {
                name: service.name,
                description: service.description || "",
                duration: service.duration,
                price: Number(service.price),
                image: null,
                featured: !service.featured
            });

            setServices((current) =>
                current.map((currentService) =>
                    currentService.id === service.id
                        ? {
                            ...currentService,
                            featured: !currentService.featured
                        }
                        : currentService
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao alterar destaque."
            );
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "Tem certeza que deseja excluir este serviço?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteService(id);

            setServices((current) =>
                current.filter(
                    (service) => service.id !== id
                )
            );

            setPromotions((current) =>
                current.filter(
                    (promotion) =>
                        promotion.service_id !== id
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir serviço."
            );
        }
    }

    function handleCreatePromotion(service: Service) {
        setPromotionServiceId(service.id);
        setEditingPromotionId(null);

        setPromotionForm({
            promotional_price: "",
            expires_at: ""
        });
    }

    function handleEditPromotion(
        promotion: Promotion
    ) {
        setPromotionServiceId(promotion.service_id);
        setEditingPromotionId(promotion.id);

        const date = new Date(promotion.expires_at);

        const localDate = new Date(
            date.getTime() -
            date.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 16);

        setPromotionForm({
            promotional_price: String(
                promotion.promotional_price
            ),
            expires_at: localDate
        });
    }

    function handleCancelPromotion() {
        setPromotionServiceId(null);
        setEditingPromotionId(null);
        setPromotionForm(initialPromotionForm);
    }

    async function handlePromotionSubmit(
        event: React.FormEvent,
        service: Service
    ) {
        event.preventDefault();

        try {
            setSavingPromotion(true);

            const promotionalPrice = Number(
                promotionForm.promotional_price
            );

            if (
                Number.isNaN(promotionalPrice) ||
                promotionalPrice < 0
            ) {
                alert("Informe um preço promocional válido.");
                return;
            }

            if (
                promotionalPrice >= Number(service.price)
            ) {
                alert(
                    "O preço promocional deve ser menor que o preço normal."
                );
                return;
            }

            if (!promotionForm.expires_at) {
                alert(
                    "Informe a data de encerramento da promoção."
                );
                return;
            }

            const expirationDate = new Date(
                promotionForm.expires_at
            );

            if (
                Number.isNaN(expirationDate.getTime()) ||
                expirationDate <= new Date()
            ) {
                alert(
                    "A data de encerramento deve ser futura."
                );
                return;
            }

            const data = {
                service_id: service.id,
                promotional_price: promotionalPrice,
                expires_at: promotionForm.expires_at
            };

            if (editingPromotionId !== null) {
                await updatePromotion(
                    editingPromotionId,
                    data
                );
            } else {
                await createPromotion(data);
            }

            handleCancelPromotion();

            await loadData();
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar promoção."
            );
        } finally {
            setSavingPromotion(false);
        }
    }

    async function handleDeletePromotion(
        promotionId: number
    ) {
        const confirmed = window.confirm(
            "Tem certeza que deseja excluir esta promoção?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePromotion(promotionId);

            setPromotions((current) =>
                current.filter(
                    (promotion) =>
                        promotion.id !== promotionId
                )
            );
        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir promoção."
            );
        }
    }

    function getPromotionForService(
        serviceId: number
    ) {
        return promotions.find(
            (promotion) =>
                promotion.service_id === serviceId
        );
    }

    function formatExpiration(
        expiresAt: string
    ) {
        return new Date(expiresAt).toLocaleString(
            "pt-BR",
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        );
    }

    if (loading) {
        return (
            <section className={styles.container}>
                <p>Carregando serviços...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.container}>
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h2>Serviços</h2>

                    <p>
                        Gerencie os serviços oferecidos.
                    </p>
                </div>
            </header>

            <div className={styles.content}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <h3>
                        {editingId !== null
                            ? "Editar serviço"
                            : "Novo serviço"}
                    </h3>

                    <div className={styles.field}>
                        <label htmlFor="name">
                            Nome
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ex: Limpeza de pele"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="description">
                            Descrição
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descrição do serviço"
                            rows={4}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label htmlFor="duration">
                                Duração (minutos)
                            </label>

                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                min="1"
                                value={form.duration}
                                onChange={handleChange}
                                placeholder="60"
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="price">
                                Preço
                            </label>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="100.00"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="image">
                            Imagem
                        </label>

                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview do serviço"
                            />
                        )}
                    </div>

                    <div className={styles.featured}>
                        <label>
                            <input
                                type="checkbox"
                                checked={form.featured}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        featured:
                                            event.target.checked
                                    }))
                                }
                            />

                            Serviço em destaque
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? "Salvando..."
                                : editingId !== null
                                    ? "Salvar alterações"
                                    : "Criar serviço"}
                        </button>

                        {editingId !== null && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                <div className={styles.list}>
                    {services.length === 0 ? (
                        <p>
                            Nenhum serviço cadastrado.
                        </p>
                    ) : (
                        services.map((service) => {
                            const promotion =
                                getPromotionForService(
                                    service.id
                                );

                            const isPromotionFormOpen =
                                promotionServiceId ===
                                service.id;

                            return (
                                <div
                                    key={service.id}
                                    className={styles.serviceWrapper}
                                >
                                    <div
                                        className={styles.card}
                                    >
                                        {service.image_url && (
                                            <div
                                                className={
                                                    styles.cardImg
                                                }
                                                style={{
                                                    backgroundImage:
                                                        `url(${service.image_url})`
                                                }}
                                            />
                                        )}

                                        <div
                                            className={
                                                styles.cardInfo
                                            }
                                        >
                                            <h4>
                                                {service.name}
                                            </h4>

                                            {service.description && (
                                                <p>
                                                    {
                                                        service.description
                                                    }
                                                </p>
                                            )}

                                            <div
                                                className={
                                                    styles.details
                                                }
                                            >
                                                <span>
                                                    {
                                                        service.duration
                                                    }
                                                    {" min"}
                                                </span>

                                                <span>
                                                    R${" "}
                                                    {Number(
                                                        service.price
                                                    ).toFixed(2)}
                                                </span>
                                            </div>

                                            <div
                                                className={
                                                    styles.serviceButtons
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleFeatured(
                                                            service
                                                        )
                                                    }
                                                    className="redirect"
                                                >
                                                    {service.featured
                                                        ? "Remover destaque"
                                                        : "Colocar em destaque"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        promotion
                                                            ? handleEditPromotion(
                                                                promotion
                                                            )
                                                            : handleCreatePromotion(
                                                                service
                                                            )
                                                    }
                                                    className={
                                                        styles.promotionButton
                                                    }
                                                >
                                                    {promotion
                                                        ? "Editar promoção"
                                                        : "Criar promoção"}
                                                </button>
                                            </div>

                                            {promotion && (
                                                <div
                                                    className={
                                                        styles.promotionInfo
                                                    }
                                                >
                                                    <span>
                                                        De R${" "}
                                                        {Number(
                                                            promotion.original_price
                                                        ).toFixed(2)}
                                                        {" "}por R${" "}
                                                        {Number(
                                                            promotion.promotional_price
                                                        ).toFixed(2)}
                                                    </span>

                                                    <small>
                                                        Até{" "}
                                                        {formatExpiration(
                                                            promotion.expires_at
                                                        )}
                                                    </small>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeletePromotion(
                                                                promotion.id
                                                            )
                                                        }
                                                    >
                                                        Excluir promoção
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            className={
                                                styles.cardActions
                                            }
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        service
                                                    )
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        service.id
                                                    )
                                                }
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>

                                    {isPromotionFormOpen && (
                                        <form
                                            className={
                                                styles.promotionForm
                                            }
                                            onSubmit={(event) =>
                                                handlePromotionSubmit(
                                                    event,
                                                    service
                                                )
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.promotionHeader
                                                }
                                            >
                                                <div>
                                                    <h4>
                                                        {editingPromotionId !==
                                                        null
                                                            ? "Editar promoção"
                                                            : "Nova promoção"}
                                                    </h4>

                                                    <p>
                                                        {
                                                            service.name
                                                        }
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCancelPromotion
                                                    }
                                                >
                                                    Fechar
                                                </button>
                                            </div>

                                            <div
                                                className={
                                                    styles.row
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.field
                                                    }
                                                >
                                                    <label htmlFor={`promotion-price-${service.id}`}>
                                                        Preço promocional
                                                    </label>

                                                    <input
                                                        id={`promotion-price-${service.id}`}
                                                        name="promotional_price"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            promotionForm.promotional_price
                                                        }
                                                        onChange={
                                                            handlePromotionChange
                                                        }
                                                        placeholder="79.90"
                                                    />

                                                    <small>
                                                        Preço normal: R${" "}
                                                        {Number(
                                                            service.price
                                                        ).toFixed(2)}
                                                    </small>
                                                </div>

                                                <div
                                                    className={
                                                        styles.field
                                                    }
                                                >
                                                    <label htmlFor={`promotion-expires-${service.id}`}>
                                                        Termina em
                                                    </label>

                                                    <input
                                                        id={`promotion-expires-${service.id}`}
                                                        name="expires_at"
                                                        type="datetime-local"
                                                        value={
                                                            promotionForm.expires_at
                                                        }
                                                        onChange={
                                                            handlePromotionChange
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className={
                                                    styles.promotionActions
                                                }
                                            >
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        savingPromotion
                                                    }
                                                >
                                                    {savingPromotion
                                                        ? "Salvando..."
                                                        : editingPromotionId !==
                                                            null
                                                            ? "Salvar promoção"
                                                            : "Criar promoção"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCancelPromotion
                                                    }
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}

export default Servicos;