import { NavLink } from 'react-router-dom';
import logo from '../img/logo_pem.png';
import { useAuthStore } from '../store/auth/auth.store';


export default function Navbar() {
    const logOut = useAuthStore(state => state.logOut);
    
    return (
        <nav className="nav">

            <figure className="nav__picture">
                <img className="nav__logo" src={logo} alt="logo" />
            </figure>

           

            <ul className="nav__container">
                <NavLink to="home" className="nav__icon">

                    {/* <img className="nav__img" src={home} alt="home-icon" /> */}
                    <svg className='nav__svg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m21.743 12.331-9-10c-.379-.422-1.107-.422-1.486 0l-9 10a.998.998 0 0 0-.17 1.076c.16.361.518.593.913.593h2v7a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-4h4v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-7h2a.998.998 0 0 0 .743-1.669z"></path></svg>
                    <li className="nav__txt">
                        Home
                    </li>
                </NavLink>

                <NavLink to="usuarios" className="nav__icon">
                    {/* <img className="nav__img" src={users} alt="users-icon" /> */}
                    <svg className='nav__svg' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>
                    <li className="nav__txt">
                        Users
                    </li>
                </NavLink>


                <span onClick={logOut} className="nav__icon nav__icon--end">
                    
                    {/* <img className="nav__img" src={exit} alt="exit-icon" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M16 13v-2H7V8l-5 4 5 4v-3z"></path><path d="M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z"></path></svg>
                    <li className="nav__txt">
                        Cerrar sesión
                    </li>
                </span>

            </ul>
        </nav>
    )
}
