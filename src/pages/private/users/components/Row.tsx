import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { instance } from "../../../../api/rh";

import { BasicUser } from '../../../../api/interfaces/response/user';
import { useDisabledUser, useEnableUser, useUsers } from '../../../../hooks/user';


interface Props {
    user: BasicUser;
}

export const Row = ({ user }: Props) => {

    const { refetch } = useUsers();
    const { mutate: disableUser } = useDisabledUser();

    const { mutate: enableUser } = useEnableUser();


    const handClick = (user: BasicUser) => {
        Swal.fire({
            title: user.status ? "¿Desea dar de baja al usuario?" : "¿Desea reintegrar al usuario?",
            text: `${user.name}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: user.status ? "Si, dar de baja" : "Si, reintegrar"
        }).then((result) => {
            if (result.isConfirmed) {
                if (user.status) {
                    disableUser(user.id, {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Dado de baja",
                                text: `El usuario: ${user.name} ha sido dado de baja con éxito`,
                                icon: "success"
                            });
                            refetch();

                        }
                    })

                } else {
                    enableUser(user.id, {
                        onSuccess() {
                            Swal.fire({
                                title: "Reintegrado!",
                                text: `El usuario: ${user.name} se reintegró con éxito`,
                                icon: "success"
                            });
                            refetch();
                        },
                        onError(error) {
                            Swal.fire({
                                title: error.message,
                                icon: 'error'
                            })
                        },
                    })
                }

            }
        });

    }

    const download = (user: BasicUser) => {
        instance.get(`users/credencial/${user.id}`, {
            responseType: "blob"
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `credencial-${user.id}.pdf`);
                document.body.appendChild(link);
                link.click()
            })
    }
    return (
        <tr className="table__body-container" >
            <td className="table__body-item" >{user.id}</td>
            <td className="table__body-item">{user.rol}</td>
            <td className="table__body-item">{user.name}</td>
            <td className="table__body-item">{user.curp}</td>
            <td className="table__body-item">{user.createdAt.toString().substring(0, 10)}</td>

            <td className="table__body-item table__body-item options">
                <NavLink to={`/dashboard/mostarInfo/${user.id}`} className="table__body-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3 1.641 0 3-1.358 3-3 0-1.641-1.359-3-3-3z"></path><path d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5-.504 1.158-2.578 5-7.926 5z"></path></svg>
                </NavLink>

                <div onClick={() => handClick(user)} className='table__body-item-button' id='toggle'>
                    <input onChange={() => { }} className='toggle' type="checkbox" name={user.id} checked={user.status} />
                    <span className='slider round'></span>
                </div>

                <NavLink to={`/dashboard/contacto/${user.id}`} className="table__body-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 2H6a2 2 0 0 0-2 2v3H2v2h2v2H2v2h2v2H2v2h2v3a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-8 2.999c1.648 0 3 1.351 3 3A3.012 3.012 0 0 1 13 11c-1.647 0-3-1.353-3-3.001 0-1.649 1.353-3 3-3zM19 18H7v-.75c0-2.219 2.705-4.5 6-4.5s6 2.281 6 4.5V18z"></path></svg>

                </NavLink>

                <NavLink to={`/dashboard/editarUsuario/${user.id}`} className="table__body-item-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>
                </NavLink>

                <span className="table__body-item-button" onClick={() => download(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"></path></svg>
                </span>
            </td>
        </tr>
    )
}


