import { NavLink } from 'react-router-dom';
import { useUsers } from '../../../hooks/user';
import { Row } from './components/Row';
import { useState } from 'react';

export const Users = () => {

    const { data, isPending } = useUsers();
    const [search, setSearch] = useState('');

    return (
        <>
            <section className="icons">

                <figure>
                    {/* <svg className='icons__addUser' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"></path><path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path></svg> */}
                </figure>

                <NavLink to="/dashboard/registro" >
                    <svg className='icons__addUser' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"></path></svg>
                </NavLink >
            </section>

            <section className='search'>
                <input placeholder='Buscar' type="text" value={search} onChange={({target})=> setSearch(target.value)} />
            </section>

            <table className="table">
                <thead className="table__header">
                    <tr>
                        <th className="table__header-item table__header-item--first">ID-User</th>
                        <th className="table__header-item">Rol</th>
                        <th className="table__header-item">Nombre</th>
                        <th className="table__header-item">CURP</th>
                        <th className="table__header-item">Fecha ingreso</th>
                        <th className="table__header-item table__header-item--end">Opciones</th>
                    </tr>
                </thead>

                <tbody className="table__body">
                    {
                        isPending &&
                        <tr>
                            <td colSpan={6}>
                                cargando........
                            </td>
                        </tr>
                    }

                    {
                        data?.filter(user=> user.name.toLowerCase().includes(search.toLowerCase())|| user.id.toLowerCase().includes(search.toLowerCase())).map(user => (
                           <Row user={user} key={user.id}/>
                        ))
                    }

                </tbody>
            </table>
        </>

    )
}


