import { createBrowserRouter, Navigate } from "react-router-dom";
import { Login } from "../pages/public/login/Login";
import { LayoutDashboard } from "../pages/private/LayoutDashboard";
import Home from "../pages/private/Home";
import { Areas } from "../pages/private/areas/Areas";
import { Offices } from "../pages/private/offices/Offices";
import { SpecialUsers } from "../pages/private/config/SpecialUsers";
import { Holidays } from "../pages/private/holidays/Holidays";
import { Enterprises } from "../pages/private/enterprises/Enterprises";
import { Courses } from "../pages/private/courses/Courses";
import { Enterprise } from "../pages/private/enterprises/Enterprise";
import { Office } from "../pages/private/offices/Office";
import { Area } from "../pages/private/areas/Area";
import { Positions } from "../pages/private/position/Positions";
import { Position } from "../pages/private/position/Position";
import { Employees } from "../pages/private/employees/Employees";
import { CreateEmployee } from "../pages/private/employees/CreateEmployee";
import { Departments } from "../pages/private/departments/Departments";
import { Department } from "../pages/private/departments/Department";
import { CreateEnterprise } from "../pages/private/enterprises/CreateEnterprise";
import { Employee } from "../pages/private/employees/Employee";
import { ChangePassword } from "../pages/private/employees/ChangePassword";
import { Profile } from "../pages/private/employees/Profile";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";


export const router = createBrowserRouter([
    {
        element: <PublicRoute />,
        children: [
            {
                path: 'login',
                element: <Login />
            }
        ]
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                path: '/dashboard',
                element: <LayoutDashboard />,
                children: [
                    {
                        path: "home",
                        element:
                            <div className="container__body container__body--center">
                                <Home />
                            </div>
                    },
                    // {
                    //     path: "usuarios",
                    //     element: <Users />,
                    // },
                    {
                        path: 'change-password',
                        element: <ChangePassword />
                    },
                    {
                        path: 'employees',
                        element: <Employees />
                    },
                    {
                        path: 'me',
                        element: <Profile />
                    },
                    {
                        path: 'employees/:id',
                        element: <Employee />
                    },
                    {
                        path: 'employees/create',
                        element: <CreateEmployee />
                    },
                    {
                        path: 'enterprises',
                        element: <Enterprises />
                    },
                    {
                        path: 'enterprises/create',
                        element: <CreateEnterprise />
                    },
                    {
                        path: 'enterprises/:id',
                        element: <Enterprise />
                    },
                    {
                        path: 'enterprises/:enterpriseID/offices/:officeID',
                        element: <Office />
                    },
                    {
                        path: 'offices',
                        element: <Offices />
                    },
                    {
                        path: 'offices/:officeID/departments/:departmentID',
                        element: <Department />
                    },
                    {
                        path: 'departments',
                        element: <Departments />
                    },
                    {
                        path: 'departments/:departmentID/areas/:areaID',
                        element: <Area />
                    },
                    {
                        path: 'areas',
                        element: <Areas />
                    },
                    {
                        path: 'areas/:areaID/positions/:positionID',
                        element: <Position />
                    },
                    {
                        path: 'positions',
                        element: <Positions />
                    },


                    
                    {
                        path: 'courses',
                        element: <Courses />
                    },
                    {
                        path: 'special-users',
                        element: <SpecialUsers />
                    },
                    {
                        path: 'config-holiday',
                        element: <Holidays />
                    }
                ],
            }
        ]
    },
    {
        path: '*',
        element: (
            <Navigate
                to="/dashboard"
                replace
            />
        ),
    }

])