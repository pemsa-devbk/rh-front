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
            {/* {
                !params.pathname.includes('usuarios')&&
                <section className="arrow">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </section>

            } */}
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
