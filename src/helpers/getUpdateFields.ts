
// export const getUpdatedFields = (original: Record<string, any>, updated: Record<string, any>) => {
//     const changes: Record<string, any> = {};

//     for (const key in updated) {
//         const originalValue = original[key];
//         const updatedValue = updated[key];
//         if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
//             changes[key] = updatedValue;
//         }
//     }

//     return changes;
// }

const normalize = (value: any) => {
    if (typeof value === 'string' && value.trim() === '') {
        return null;
    }

    return value;
};

const areEqual = (a: any, b: any) => {
    a = normalize(a);
    b = normalize(b);

    if (
        a !== null &&
        b !== null &&
        typeof a === 'object' &&
        typeof b === 'object'
    ) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    return a === b;
};

export const getUpdatedFields = (
    original: Record<string, any>,
    updated: Record<string, any>
) => {
    const changes: Record<string, any> = {};

    for (const key in updated) {
        const normalizedUpdatedValue = normalize(updated[key]);

        if (!areEqual(original[key], normalizedUpdatedValue)) {
            changes[key] = normalizedUpdatedValue;
        }
    }

    return changes;
};