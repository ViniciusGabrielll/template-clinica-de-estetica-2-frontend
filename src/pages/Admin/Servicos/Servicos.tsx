import { useEffect, useState } from "react";

import {
    getServices,
    createService,
    updateService,
    deleteService,
    type Service
} from "../../../services/api";

import styles from "./Servicos.module.css";

type FormData = {
    name: string;
    description: string;
    duration: string;
    price: string;
    image: File | null;
};

const initialForm: FormData = {
    name: "",
    description: "",
    duration: "",
    price: "",
    image: null
};

function Servicos() {
    const [services, setServices] =
        useState<Service[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [form, setForm] =
        useState<FormData>(initialForm);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [saving, setSaving] =
        useState(false);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    async function loadServices() {
        try {
            setLoading(true);
            setError("");

            const data = await getServices();

            setServices(data);
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
        loadServices();
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
            image: null
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

            const duration =
                Number(form.duration);

            const price =
                Number(form.price);

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
                image: form.image
            };

            if (editingId !== null) {
                await updateService(
                    editingId,
                    data
                );
            } else {
                await createService(data);
            }

            setForm(initialForm);
            setEditingId(null);
            setImagePreview(null);

            await loadServices();
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

    async function handleDelete(id: number) {
        const confirmed =
            window.confirm(
                "Tem certeza que deseja excluir este serviço?"
            );

        if (!confirmed) {
            return;
        }

        try {
            await deleteService(id);

            setServices((current) =>
                current.filter(
                    (service) =>
                        service.id !== id
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
                        services.map((service) => (
                            <div
                                key={service.id}
                                className={styles.card}
                            >
                                {service.image_url && (
                                    <div
                                        className={styles.cardImg}
                                        style={{backgroundImage: `url(${service.image_url})`}}
                                    />
                                )}

                                <div className={styles.cardInfo}>
                                    <h4>
                                        {service.name}
                                    </h4>

                                    {service.description && (
                                        <p>
                                            {service.description}
                                        </p>
                                    )}

                                    <div
                                        className={
                                            styles.details
                                        }
                                    >
                                        <span>
                                            {service.duration}
                                            {" min"}
                                        </span>

                                        <span>
                                            R$ {Number(
                                                service.price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={
                                        styles.cardActions
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEdit(service)
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
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

export default Servicos;