import { useEffect, useState } from "react";

import {
    getBusinessHours,
    createBusinessHour,
    updateBusinessHour,
    deleteBusinessHour,
    type BusinessHour
} from "../../../services/api";

import styles from "./Horarios.module.css";


type FormData = {
    day_of_week: string;
    opening_time: string;
    closing_time: string;
};


const initialForm: FormData = {
    day_of_week: "1",
    opening_time: "",
    closing_time: ""
};


const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];


function Horarios() {

    const [businessHours, setBusinessHours] =
        useState<BusinessHour[]>([]);

    const [form, setForm] =
        useState<FormData>(initialForm);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    async function loadBusinessHours() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getBusinessHours();

            setBusinessHours(data);

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar horários."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadBusinessHours();

    }, []);


    function handleChange(
        event:
            React.ChangeEvent<
                HTMLInputElement |
                HTMLSelectElement
            >
    ) {

        const { name, value } =
            event.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    }


    function handleEdit(
        businessHour: BusinessHour
    ) {

        setEditingId(
            businessHour.id
        );

        setForm({
            day_of_week:
                String(
                    businessHour.day_of_week
                ),

            opening_time:
                businessHour.opening_time
                    .slice(0, 5),

            closing_time:
                businessHour.closing_time
                    .slice(0, 5)
        });
    }


    function handleCancelEdit() {

        setEditingId(null);

        setForm(initialForm);
    }


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        if (!form.opening_time ||
            !form.closing_time) {

            alert(
                "Informe o horário de abertura e fechamento."
            );

            return;
        }


        if (
            form.opening_time >=
            form.closing_time
        ) {

            alert(
                "O horário de abertura deve ser anterior ao fechamento."
            );

            return;
        }


        try {

            setSaving(true);

            const data = {
                day_of_week:
                    Number(form.day_of_week),

                opening_time:
                    form.opening_time,

                closing_time:
                    form.closing_time
            };


            if (editingId !== null) {

                await updateBusinessHour(
                    editingId,
                    data
                );

            } else {

                await createBusinessHour(
                    data
                );
            }


            setForm(initialForm);

            setEditingId(null);

            await loadBusinessHours();

        } catch (error) {

            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao salvar horário."
            );

        } finally {

            setSaving(false);

        }
    }


    async function handleDelete(
        id: number
    ) {

        const confirmed =
            window.confirm(
                "Tem certeza que deseja excluir este horário?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteBusinessHour(id);

            setBusinessHours(
                (current) =>
                    current.filter(
                        (hour) =>
                            hour.id !== id
                    )
            );

        } catch (error) {

            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao excluir horário."
            );
        }
    }


    if (loading) {

        return (
            <section className={styles.container}>
                <p>
                    Carregando horários...
                </p>
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

                    <h2>
                        Horários de funcionamento
                    </h2>

                    <p>
                        Configure os períodos em que
                        os agendamentos podem ser realizados.
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
                            ? "Editar horário"
                            : "Novo horário"}
                    </h3>


                    <div className={styles.field}>

                        <label htmlFor="day_of_week">
                            Dia da semana
                        </label>

                        <select
                            id="day_of_week"
                            name="day_of_week"
                            value={form.day_of_week}
                            onChange={handleChange}
                        >

                            {daysOfWeek.map(
                                (day, index) => (

                                    <option
                                        key={index}
                                        value={index}
                                    >
                                        {day}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className={styles.field}>

                        <label htmlFor="opening_time">
                            Abertura
                        </label>

                        <input
                            id="opening_time"
                            name="opening_time"
                            type="time"
                            value={form.opening_time}
                            onChange={handleChange}
                        />

                    </div>


                    <div className={styles.field}>

                        <label htmlFor="closing_time">
                            Fechamento
                        </label>

                        <input
                            id="closing_time"
                            name="closing_time"
                            type="time"
                            value={form.closing_time}
                            onChange={handleChange}
                        />

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
                                    : "Adicionar horário"}
                        </button>


                        {editingId !== null && (

                            <button
                                type="button"
                                onClick={
                                    handleCancelEdit
                                }
                            >
                                Cancelar
                            </button>

                        )}

                    </div>

                </form>


                <div className={styles.list}>


                    {daysOfWeek.map(
                        (day, dayIndex) => {

                            const dayHours =
                                businessHours.filter(
                                    (hour) =>
                                        hour.day_of_week ===
                                        dayIndex
                                );


                            return (

                                <div
                                    key={dayIndex}
                                    className={styles.day}
                                >

                                    <div
                                        className={
                                            styles.dayHeader
                                        }
                                    >

                                        <h4>
                                            {day}
                                        </h4>

                                    </div>


                                    {dayHours.length === 0 ? (

                                        <p
                                            className={
                                                styles.closed
                                            }
                                        >
                                            Fechado
                                        </p>

                                    ) : (

                                        dayHours.map(
                                            (hour) => (

                                                <div
                                                    key={
                                                        hour.id
                                                    }
                                                    className={
                                                        styles.hour
                                                    }
                                                >

                                                    <span>
                                                        {hour.opening_time.slice(0, 5)}
                                                        {" — "}
                                                        {hour.closing_time.slice(0, 5)}
                                                    </span>


                                                    <div
                                                        className={
                                                            styles.hourActions
                                                        }
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    hour
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    hour.id
                                                                )
                                                            }
                                                        >
                                                            Excluir
                                                        </button>

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            );

                        }
                    )}

                </div>

            </div>

        </section>
    );
}


export default Horarios;