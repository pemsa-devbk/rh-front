import { useParams } from 'react-router-dom';
import { useUser } from '../../../hooks/user';

export default function ViewUser() {

    const { id } = useParams();

    const { data, isPending } = useUser(id!);

    return (
        <>
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
                                <p>Estado de la republica: <span>{data?.state?.name}</span></p>
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
                                <p>Ingreso: <span>{data?.createdAt.toString().substring(0, 10)}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Ultima actualización: <span>{data?.upDateAt?.toString().substring(0, 10)}</span></p>
                            </div>
                            <div className='viewuser__text'>
                                <p>Jefe directo: <span>{data?.userChief?.name}</span></p>
                            </div>
                        </div>
                    </article>
                </section>
            </div>


            <div className='tableMovs'>
                <table className='table'>

                    <thead className='table__header'>
                        <tr>
                            <th className='table__header--title' colSpan={4}>Movimientos del usuario</th>
                        </tr>
                        <tr>
                            <th className='table__header-item table__header-item--first'> Movimiento</th>
                            <th className='table__header-item'> Fecha de ingreso </th>
                            <th className='table__header-item'> Usuario encargado del registro</th>
                            <th className='table__header-item table__header-item--end' > Tipo de movimiento </th>
                        </tr>
                    </thead>

                    <tbody className='table__body'>
                        {
                            isPending &&
                            <tr>
                                <td>
                                    Cargando........
                                </td>
                            </tr>
                        }

                        {
                            data?.misMovs?.map((mov) => (
                                <tr key={mov.id} className='table__body-container'>
                                    <td className='table__body-item'>{mov.id}</td>
                                    <td className='table__body-item'>{mov.createdAt.toString().substring(0, 10)}</td>
                                    <td className='table__body-item'>{mov.createdBy.name} Id: {mov.createdBy.id}</td>
                                    <td className='table__body-item'>{mov.movType.nameMov}</td>
                                </tr>
                            ))
                        }
                        {
                            data?.misMovs?.map((mov) => (
                                <tr key={mov.id} className='table__body-container'>
                                    <td className='table__body-item'>{mov.id}</td>
                                    <td className='table__body-item'>{mov.createdAt.toString().substring(0, 10)}</td>
                                    <td className='table__body-item'>{mov.createdBy.name} Id: {mov.createdBy.id}</td>
                                    <td className='table__body-item'>{mov.movType.nameMov}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <section className='viewuserContact'>
                <p className='viewuserContact__title'>Contactos</p>
                <div className='viewuserContact__container'>
                    {
                        data?.contacts?.map((contact) => (

                            <div key={contact.id} className='contact'>
                                <div className={`contact__picture ${contact.type == 1 ? 'contact__picture--phone' : ''}`}>
                                    {
                                        contact.type == 1
                                            ?
                                            <svg className='contact__img' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"></path></svg>

                                            :

                                            <svg className='contact__img' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m20.487 17.14-4.065-3.696a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.085-1.39z"></path></svg>

                                    }

                                </div>

                                <div className='contact__texts'>
                                    <p>
                                        {
                                            contact.contact
                                        }
                                    </p>
                                    <p>
                                        {
                                            contact.notes
                                        }
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            {/* <div className="register__button">
                <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--colorViewuser">Back</Link>
            </div> */}
        </>

    )
}
