import dayjs from "dayjs";

export const getUpdatedFields = (original: Record<string, any>, updated: Record<string, any>) => {
    const changes: Record<string, any> = {};

    for (const key in updated) {
        const originalValue = original[key];
        const updatedValue = updated[key];

        // Si ambos son fechas (Date o dayjs), comparamos formateados
        if (
            (dayjs.isDayjs(originalValue) || originalValue instanceof Date) &&
            (dayjs.isDayjs(updatedValue) || updatedValue instanceof Date)
        ) {
            const originalFormatted = dayjs(originalValue).format('YYYY-MM-DD');
            const updatedFormatted = dayjs(updatedValue).format('YYYY-MM-DD');

            if (originalFormatted !== updatedFormatted) {
                changes[key] = updatedFormatted;
            }
        }
        // Si son distintos (considerando null, undefined, etc.)
        else if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
            changes[key] = updatedValue;
        }
    }

    return changes;
}