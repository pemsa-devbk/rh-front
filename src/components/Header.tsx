import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth/auth.store";

export default function Header() {
    const params = useLocation();
    const user = useAuthStore(state => state.user);



    return (
        <header className="header">
            <section className="header__texts">
                <h2>{
                    params.pathname.includes('usuarios') 
                    ? 'Gestion de usuarios' 
                        : params.pathname.includes('registro')
                        ? 'Creación de usuario usuario'
                        :
                            params.pathname.includes('editarUsuario')
                            ? 'Edición de usuario'
                            :
                                params.pathname.includes('mostar')
                                ? 'Información de usuario'
                                :
                    'Pagina de incio'
                }
                </h2>
                <p>{new Date().toDateString()}</p>
            </section>

            <section className="header__actions">
                <div className="header__user">
                    <p>{user?.name}</p>
                    <p>{user?.rol}</p>
                </div>
                <div className="header__img">
                    <p>{user?.name.charAt(0)}</p>
                </div>
            </section>

        </header>
    )
}
