import { NavLink } from "react-router-dom";
import { useContadorStore } from "../../store/contador/contador"

export const Contador = () => {

    const value = useContadorStore(state=> state.value);
    const increment = useContadorStore(state=> state.increment);
    const decrement = useContadorStore(state => state.decrement);
    const reset = useContadorStore(state=>state.reset);
  return (
    <div>
        <section>
            <button onClick={decrement}>-</button>
            <span>{value}</span>
            <button onClick={increment}>+</button>
            <button onClick={reset}>reset</button>
        </section>
        <NavLink to='/login'>Login</NavLink>
    </div>
  )
}
