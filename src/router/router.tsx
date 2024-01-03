import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/public/login/Login";
import { Contador } from "../pages/example/Contador";
import { LayoutDashboard } from "../pages/private/LayoutDashboard";
import Home from "../pages/private/Home";
import { Users } from "../pages/private/users/Users";
import Register from "../pages/private/users/Register";
import Contact from "../pages/private/contacts/Contact";
import ViewUser from "../pages/private/users/ViewUser";
import { EditUser } from "../pages/private/users/EditUser";
import Root from "../pages/Root";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <div>ErrorPage</div>,
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "contador",
                element: <Contador />
            },
            {
                path: "dashboard",
                element: <LayoutDashboard />,
                children: [
                    {
                        path: "home",
                        element: <div className="container__body">
                             <Home/>
                        </div>
                    },
                    {
                        path: "usuarios",
                        element: <div className="container__body container__body--users">
                           <Users/>
                        </div>,
                        // children:[ la primera es dejarlo sin clase y ocupar un fragment en nuestro html
                        //     { //segunda solución
                        //         path: "registro",
                        //         element: <div className="container__body container__body--register">
                        //             <Register/>
                        //         </div>
                        //     }
                            
                        // ]
                    },
                    {
                        path: "registro",
                        element: <div className="container__body container__body--register">
                            <Register/>
                        </div>
                    },
                    {
                        path: "contacto/:id",
                        element: <div className="container__body container__body--contact">
                            <Contact/>
                        </div>
                    },
                    {
                        path:"mostarInfo/:id",
                        element: <div className="container__body container__body--mostrarInfo">
                            <ViewUser/>
                        </div>
                    },
                    {
                        path:"editarUsuario",
                        element: <div className="container__body container__body--editUser" > 
                            <EditUser/>
                        </div>
                    }
                   
                ],
            }
        ],

    }

])