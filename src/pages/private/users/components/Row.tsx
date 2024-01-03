import { NavLink } from "react-router-dom";
import { User } from "../../../../api/interfaces/users";
import iconContact from '../../../../img/icon/address-book.png';
import iconEye from '../../../../img/icon/eye.png';
import iconEdit from '../../../../img/icon/pen-square.png';
import iconQr from '../../../../img/icon/qr.png';
import Swal from "sweetalert2";
import { useDeleteUser, useReintegroUser, useUsers } from "../../../../hooks/user";
import { instance } from "../../../../api/rh";


interface Props {
    user: User;
}

export const Row = ({ user }: Props) => {

    const { refetch } = useUsers();
    const { mutate } = useDeleteUser();

    const { mutate: reintegro } = useReintegroUser();

    const generateQR = async (id: string) => {
       //decodifica la info perteneciente al ID

        Swal.fire({
            title: "Código QR",
            text: "QR del usuario",
            imageUrl: "urlCode",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image"
        });
    }

    const handClick = (user: User) => {
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
                    mutate(user.id, {
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
                    reintegro(user.id, {
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

    const download = (user: User) => {
        instance.get(`users/credencial/${user.id}`, {
            responseType: "blob"
        })
        .then((response)=> {
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
            <td className="table__body-item">{user.createdAt.toLocaleString()}</td>

            <td className="table__body-item">
                <NavLink to={`/dashboard/mostarInfo/${user.id}`} className="table__body-item-button">
                    <img className="table__body-item-button" src={iconEye} alt="see-info" />
                </NavLink>

                <div onClick={() => handClick(user)} className='table__body-item-button' id='toggle'>
                    <input onChange={() => { }} className='toggle' type="checkbox" name={user.id} checked={user.status} />
                    <span className='slider round'></span>
                </div>

                <NavLink to={`/dashboard/contacto/${user.id}`} className="table__body-item-button">
                    <img className="table__body-item-button" src={iconContact} alt="contacts" />
                </NavLink>

                <NavLink to="/dashboard/editarUsuario" className="table__body-item-button">
                    <img className="table__body-item-button" src={iconEdit} alt="edit" />
                </NavLink>

                <img onClick={() => generateQR(user.id)} className="table__body-item-button" src={iconQr} alt="qr" />

                <button onClick={() => download(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M19 9h-4V3H9v6H5l7 8zM4 19h16v2H4z"></path></svg>
                </button>
            </td>
        </tr>
    )
}


