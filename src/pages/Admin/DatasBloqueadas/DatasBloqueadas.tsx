import { useEffect, useState } from "react";

import {
    getBlockedDates,
    createBlockedDate,
    deleteBlockedDate,
    type BlockedDate
} from "../../../services/api";

import styles from "./DatasBloqueadas.module.css";


function DatasBloqueadas() {

    const [blockedDates, setBlockedDates] =
        useState<BlockedDate[]>([]);

    const [date, setDate] =
        useState("");

    const [reason, setReason] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    async function loadBlockedDates() {

        try {

            setLoading(true);
            setError("");

            const data =
                await getBlockedDates();

            setBlockedDates(data);

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao carregar datas bloqueadas."
            );

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadBlockedDates();

    }, []);


    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();

        if (!date) {

            alert(
                "Selecione uma data."
            );

            return;
        }


        try {

            setSaving(true);

            await createBlockedDate({
                date,
                reason: reason.trim()
            });


            setDate("");
            setReason("");

            await loadBlockedDates();

        } catch (error) {

            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao bloquear data."
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
                "Tem certeza que deseja desbloquear esta data?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteBlockedDate(id);

            setBlockedDates(
                (current) =>
                    current.filter(
                        (blockedDate) =>
                            blockedDate.id !== id
                    )
            );

        } catch (error) {

            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Erro ao desbloquear data."
            );
        }
    }


    function formatDate(
        date: string
    ) {

        const [year, month, day] =
            date
                .slice(0, 10)
                .split("-");

        return `${day}/${month}/${year}`;
    }


    if (loading) {

        return (
            <section className={styles.container}>
                <p>
                    Carregando datas bloqueadas...
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
                        Datas bloqueadas
                    </h2>

                    <p>
                        Impedir novos agendamentos
                        em datas específicas.
                    </p>

                </div>

            </header>


            <div className={styles.content}>

                {/* FORMULÁRIO */}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    <h3>
                        Bloquear uma data
                    </h3>


                    <div className={styles.field}>

                        <label htmlFor="date">
                            Data
                        </label>

                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className={styles.field}>

                        <label htmlFor="reason">
                            Motivo
                        </label>

                        <input
                            id="reason"
                            type="text"
                            value={reason}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Ex: Feriado"
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Bloqueando..."
                            : "Bloquear data"}
                    </button>

                </form>


                {/* LISTA */}

                <div className={styles.list}>

                    <h3>
                        Datas bloqueadas
                    </h3>


                    {blockedDates.length === 0 ? (

                        <p className={styles.empty}>
                            Nenhuma data bloqueada.
                        </p>

                    ) : (

                        blockedDates.map(
                            (blockedDate) => (

                                <div
                                    key={
                                        blockedDate.id
                                    }
                                    className={
                                        styles.card
                                    }
                                >

                                    <div>

                                        <strong>
                                            {formatDate(
                                                blockedDate.date
                                            )}
                                        </strong>

                                        {blockedDate.reason && (

                                            <p>
                                                {
                                                    blockedDate.reason
                                                }
                                            </p>

                                        )}

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                blockedDate.id
                                            )
                                        }
                                    >
                                        Desbloquear
                                    </button>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>

        </section>
    );
}


export default DatasBloqueadas;