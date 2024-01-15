import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../../hooks/user';

export default function ViewUser() {

    const { id } = useParams();

    const { data } = useUser(id!);

    return (
        <>

            {/* <section className="container__info">
                <h2 className="container__info-title">Información del usuario: {data?.name}</h2>
                <Link to="/dashboard/usuarios">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </Link>
            </section> */}

            <div className="viewuser">
                <section className="viewuser__media">
                    <div className="viewuser__picture">
                        <img className="viewuser__img" src={data?.urlPhoto} alt="photo-user" />
                    </div>
                    <p className='viewuser__name'>{data?.name}</p>
                </section>

                <section className='viewuser__information'>
                    <article className='viewuser__box'>
                        <p className='viewuser__subtitle'>Información de perfil</p>
                        <div className="viewuser__data">
                            <div className='viewuser__text'>
                                <p>Número de empleado: <span>{data?.id}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Fecha de nacimiento: <span>{data?.birthdate.toString()}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Número de telefono: <span>{data?.phone}</span></p>
                            </div>
                        </div>
                    </article>
                    <article className='viewuser__box'>
                        <p className='viewuser__subtitle'>Información medica</p>
                        <div className="viewuser__data">
                            <div className='viewuser__text'>
                                <p>Alergias: <span>{data?.allergies}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Tipo de sangre: <span>{data?.bloodType}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Número de seguro social: <span>{data?.nss}</span></p>
                            </div>
                        </div>
                    </article>

                    <article className='viewuser__box'>
                        <p className='viewuser__subtitle'>Información general</p>
                        <div className="viewuser__data">
                            <div className='viewuser__text'>
                                <p>Dirección: <span>{data?.address}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Estado de la republica: <span>{data?.state.name}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Posición: <span>{data?.position}</span></p>
                            </div>
                        </div>
                    </article>

                    <article className='viewuser__box'>
                        <p className='viewuser__subtitle'>Otros datos</p>
                        <div className="viewuser__data">
                            <div className='viewuser__text'>
                                <p>CURP: <span>{data?.curp}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>CUIP: <span>{data?.cuip}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Rol: <span>{data?.rol}</span></p>
                            </div>
                        </div>
                    </article>

                    <article className='viewuser__box'>
                        <p className='viewuser__subtitle'>Datos de registro</p>
                        <div className="viewuser__data">
                            <div className='viewuser__text'>
                                <p>Ingreso: <span>{data?.createdAt.toString().substring(0,10)}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Ultima actualización: <span>{data?.upDateAt?.toString().substring(0,10)}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Jefe directo: <span>{data?.userChief?.name}</span></p>
                            </div>
                        </div>
                    </article>

                    
                </section>

                

                {/* <section className='register__viewUser register__viewUser-sectionContact'>

                    <div className=" register__texts register__texts-viewUserContact">
                        {
                            data?.contacts?.map((contact, id) => (

                                <div key={contact.id} className="register__texts-username register__texts-username--viewcontacts">
                                   
                                        <div className='register__texts-username register__texts-username--contContactos'>
                                            <p className="register__texts-contact register__texts-contact--title">Contact {id}:</p>
                                            <p className="register__texts-contact register__texts-contact--subtitle">{contact.notes} </p>

                                        </div>

                                        <div className='register__texts-username register__texts-username--contContactos register__texts-username register__texts-username--contContactos--contContactos2'>
                                            <p className="register__texts-contact">Type contact: {contact.type == 1 ? "Correo" : "Número"}  </p>
                                            <p className="register__texts-contact">Contacto: {contact.contact}</p>
                                        </div>
                                    
                                </div>
                            ))
                        }
                    </div>
                </section> */}
            </div>

            {/* <div className="register__button">
                <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--colorViewuser">Back</Link>
            </div> */}
        </>

    )
}
