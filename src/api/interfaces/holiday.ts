export interface Holiday {
    request_holiday_id: number;
    comment: string | null;
    status: StatusHoliday;
    have_format: boolean;
    created_at: string;
    employee_id: string;
    days: Array<{ holidays_days_id: number; date: string }>;
    others: {
        text: string;
        nextDate: string;
    }
}

export enum  StatusHoliday {
    SOLICITUD = 0,
    APROBADA = 1,
    RECHAZADA = 2,
    CURSO = 3,
    FINALIZADA = 4,
    CANCELADA = 5
}

export interface HolidayResponseCreate{
    message: string;
    id: number;
}

export interface FormHoliday {
    days: Array<string>;
    comment: string;
}

export interface HolidayConfig {
    holiday_config_id: number;
    min_year: number;
    max_year: number;
    number_days: number;
}

export interface HolidayConfigForm {
    min_year: number;
    max_year: number;
    number_days: number;
}