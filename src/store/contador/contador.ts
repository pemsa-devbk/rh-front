// import { StateCreator } from 'zustand';
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface CounterState{
    value:number;

    increment : () => void;
    decrement : () => void;
    reset: () => void;

}

// const storeApi: StateCreator<CounterState, [["zustand/persist", unknown]]> = (set) => ({
//     value : 10,
//     decrement: () => set(state=>({value : state.value-1})),
//     increment: () => set(state =>({value: state.value+1})),
//     reset: () => set({value:0})
// })


export const useContadorStore = create <CounterState>()(
    persist(
        (set) => ({
            value : 10,
            decrement: () => set(state=>({value : state.value-1})),
            increment: () => set(state =>({value: state.value+1})),
            reset: () => set({value:0})
        })
        ,{name:"counter"})
)