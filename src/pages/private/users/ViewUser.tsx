import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../../hooks/user';
import photoUser from '../../../img/icon/circle-user.png';




export default function ViewUser() {

    const { id } = useParams();

    const { data } = useUser(id!);

    return (
        <>

            <section className="container__info">
                <h2 className="container__info-title">Información del usuario: {data?.name}</h2>
                <Link to="/dashboard/usuarios" >
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>

                    {/* <img className="container__info-icon" src={closeWindow} alt="imgClose" /> */}
                </Link>
            </section>

            <div className="register register--viewUser">
                <section className='register__viewUser'>
                    <section className='register__viewUser-userInfo'>
                        <img className="register__photo--viewUser" src={photoUser} alt="photo-user" />

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Id de empleado: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.id}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Nombre: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.name}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Puesto:</p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.position || "none"}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Fecha de nacimiento: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{ }</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Teléfono: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.phone}</p>
                        </div>

                    </section>

                    <section className='register__viewUser-userInfo'>
                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >CURP: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.curp}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Dirección: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.address}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Tipo de sangre: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.bloodType}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Alergias: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.allergies}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >NSS: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.nss}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >CUIP: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.cuip}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Jefe directo: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.userChief?.name || "none"}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT" >Rol: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.rol}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Ubicacion de Oficina: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.state?.name}</p>
                        </div>

                        <div className='register__texts-viewUser'>
                            <p className="register__texts-username register__texts-username--shortnameT">Fecha de ingreso: </p>
                            <p className="register__texts-username register__texts-username--nameResponse">{data?.createdAt.toLocaleString()}</p>
                        </div>
                    </section>

                </section>

                <section className='register__viewUser register__viewUser--sectionContact'>
                    <p className='title-contact'>Contactos</p>
                    {
                        data?.contacts?.map(contact => (

                            <section className="register__texts register__texts--textViewUsers" key={contact.id}>
                                <p className="register__texts-username register__texts-username--contactViewUser">{contact.contact}</p>
                                <p className="register__texts-username register__texts-username--contactViewUser"> {contact.type} </p>
                                <p className="register__texts-username register__texts-username--contactViewUser"> {contact.notes} </p>

                            </section>
                        ))
                    }
                </section>
            </div>

            <div className="register__button">
                <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--colorViewuser">Back</Link>
            </div>
        </>

    )
}
