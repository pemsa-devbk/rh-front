export interface Holiday {
    request_holiday_id: number;
    comment: string | null;
    status: StatusHoliday;
    have_format: boolean;
    created_at: string;
    user_id: string;
    days: Array<{ holidays_days_id: number; date: string }>;
    others: {
        text: string;
        nextDate: string;
    }
}

export enum StatusHoliday {
    pendiente = 0,
    curso = 1,
    cancelado = 2,
    finalizada = 3,
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

export interface HolidayCOnfigForm {
    min_year: number;
    max_year: number;
    number_days: number;
}