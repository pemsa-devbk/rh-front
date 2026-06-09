import { useCallback, useState } from "react";

// Tipo para las keys de los modales
type ModalKeys = string;

// Tipo para el estado de los modales
type ModalState<T extends ModalKeys> = {
    [K in T]: boolean;
};

export const useModals = <T extends ModalKeys>(modalKeys: T[]) => {
    // Crear estado inicial con todos los modales cerrados
    const initialState = modalKeys.reduce((acc, key) => {
        acc[key] = false;
        return acc;
    }, {} as ModalState<T>);

    const [modals, setModals] = useState<ModalState<T>>(initialState);

    // Función para abrir un modal específico
    const openModal = useCallback((key: T) => {
        setModals(prev => ({ ...prev, [key]: true }));
    }, []);

    // Función para cerrar un modal específico
    const closeModal = useCallback((key: T) => {
        setModals(prev => ({ ...prev, [key]: false }));
    }, []);

    // Función para togglear un modal específico
    const toggleModal = useCallback((key: T) => {
        setModals(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    // Función para resetear al estado inicial
    const reset = useCallback(() => {
        setModals(modalKeys.reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {} as ModalState<T>));
    }, []); // sin dependencias

    return {
        // Estado de los modales
        modals,

        // Funciones genéricas
        openModal,
        closeModal,
        toggleModal,
        reset,

        // Helper para verificar si un modal está abierto
        isOpen: (key: T) => modals[key],
    }
}