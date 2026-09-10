const API_URL = "https://template-clinica-de-estetica-backend-production.up.railway.app";

export interface Service {
    id: number;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    active: boolean;
}

export interface AvailableTime {
    time: string;
}

export interface CreateAppointmentData {
    service_ids: number[];
    customer_name: string;
    customer_phone: string;
    appointment_date: string;
    start_time: string;
}

export interface AppointmentResponse {
    message: string;
    appointmentId: number;
    appointment: {
        service: string;
        date: string;
        start_time: string;
        end_time: string;
        customer_name: string;
        customer_phone: string;
    };
}

export interface BusinessHour {
    id: number;
    day_of_week: number;
    opening_time: string;
    closing_time: string;
    active: boolean;
}

export interface BlockedDate {
    id: number;
    date: string;
    reason: string | null;
}


export async function getBlockedDates(): Promise<BlockedDate[]> {

    const response = await fetch(
        `${API_URL}/blocked-dates`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Erro ao buscar datas bloqueadas."
        );
    }

    return data;
}


export async function createBlockedDate(data: {
    date: string;
    reason: string;
}) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/blocked-dates`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Erro ao bloquear data."
        );
    }

    return result;
}


export async function deleteBlockedDate(
    id: number
) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/blocked-dates/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Erro ao desbloquear data."
        );
    }

    return result;
}


export async function getBusinessHours(): Promise<BusinessHour[]> {

    const response = await fetch(
        `${API_URL}/business-hours`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Erro ao buscar horários de funcionamento."
        );
    }

    return data;
}


export async function createBusinessHour(data: {
    day_of_week: number;
    opening_time: string;
    closing_time: string;
}) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/business-hours`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Erro ao criar horário."
        );
    }

    return result;
}


export async function updateBusinessHour(
    id: number,
    data: {
        day_of_week: number;
        opening_time: string;
        closing_time: string;
    }
) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/business-hours/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Erro ao atualizar horário."
        );
    }

    return result;
}


export async function deleteBusinessHour(
    id: number
) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/business-hours/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message ||
            "Erro ao excluir horário."
        );
    }

    return result;
}

export async function createService(data: {
    name: string;
    description: string;
    duration: number;
    price: number;
}) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/services`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Erro ao criar serviço."
        );
    }

    return result;
}


export async function updateService(
    id: number,
    data: {
        name: string;
        description: string;
        duration: number;
        price: number;
    }
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/services/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Erro ao atualizar serviço."
        );
    }

    return result;
}


export async function deleteService(id: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/services/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Erro ao excluir serviço."
        );
    }

    return result;
}

export async function getServices(): Promise<Service[]> {
    const response = await fetch(
        `${API_URL}/services`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar serviços.");
    }

    return response.json();
}

export async function getAvailableTimes(
    date: string,
    serviceIds: number[]
): Promise<string[]> {

    const params = new URLSearchParams();

    params.append("date", date);

    serviceIds.forEach((serviceId) => {
        params.append("service_ids", serviceId.toString());
    });

    const response = await fetch(
        `${API_URL}/appointments/available?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar horários.");
    }

    return response.json();
}

export async function createAppointment(data: {
    service_ids: number[];
    customer_name: string;
    customer_phone: string;
    appointment_date: string;
    start_time: string;
}) {
    const response = await fetch(
        `${API_URL}/api/appointments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Erro ao criar agendamento."
        );
    }

    return result;
}

export type Appointment = {
    id: number;
    customer_name: string;
    customer_phone: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    status: string;
    service_name: string;
    duration: number;
    price: number | string;
};

export async function getAppointments(): Promise<Appointment[]> {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/appointments`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erro ao buscar agendamentos."
        );
    }

    return data;
}

export async function updateAppointmentStatus(
    id: number,
    status: string
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/api/appointments/${id}/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                status,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erro ao atualizar status."
        );
    }

    return data;
}