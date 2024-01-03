import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUser, useRoles, useStates, useUsers } from '../../../hooks/user';
import photoUser from '../../../img/icon/circle-user.png';
import { BloodType } from '../../../api/interfaces/users';

interface Contact {
    type: number;
    contact: string;
    notes: string;
}

type Inputs = {
    id: string;
    name: string;
    position: string;
    phone: string;
    birthdate: Date;
    curp: string;
    address: string;
    bloodType: BloodType[];
    allergies: string;
    nss: string;
    cuip: string;
    password: string;
    rol: string;
    idChief: string;
    idState: number;
    contacts: Contact[];
    imag: FileList;
}

export default function Register() {
    const navigate = useNavigate();

    const { data: users } = useUsers();

    const {
        register,
        handleSubmit
    } = useForm<Inputs>()

    const { mutate } = useCreateUser();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const { imag, ...rest } = data;
        const formData = new FormData();
        formData.append("data", JSON.stringify({ ...rest, idState: Number(rest.idState), contacts: [] }))
        formData.append("imag", imag[0])

        mutate(formData)
    }

    const { data: states } = useStates();
    const { data: roles } = useRoles();

    return (
        <>
            <section className="title">
                <h2 className="title__container">Creación de usuario</h2>
            </section>

            <section className="register register--addUser">
                <div className="register__photo">
                    <img className="register__photo-user" src={photoUser} alt="photo-user" />
                </div>

                <form className="register__texts" name='form-addUser' onSubmit={handleSubmit(onSubmit)}>

                    <div className='register__texts register__texts--addUser'>
                        <div className='register__texts-inputBox'>
                            <input {...register("id")} type="text" required />
                            <span>ID de empleado </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("name")} type="text" required />
                            <span >Nombre del usuario</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("position")} type="text" required />
                            <span >Puesto</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("password")} type="text" required />
                            <span >Contraseña </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("birthdate")} type="date" />
                            <span >Fecha de nacimiento:</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("phone")} type="number" required />
                            <span >Teléfono</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("curp")} type="text" required />
                            <span >CURP</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("address")} type="text" required />
                            <span >Dirección </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("bloodType")} id="tipoSangre">
                            </select>
                            <span>Tipo de sangre</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("allergies")} type="text" required />
                            <span >Alergias </span>
                        </div>
                        <div className='register__texts-inputBox'>
                            <input {...register("nss")} type="text" required />
                            <span >NSS </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("cuip")} type="text" required />
                            <span >CUIP </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("idChief")} id="jefe-directo">
                                {
                                    users?.map(user => {
                                        return <option value={user.id}>{user.name}</option>
                                    })
                                }
                            </select>
                            <span>Jefe directo</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("rol")} id="rol-empleado">
                                {
                                    roles?.map(rol => {
                                        return <option value={rol}>{rol}</option>
                                    })
                                }
                            </select>
                            <span>Rol del usuario</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("idState")} id="state">
                                {
                                    states?.map(state => {
                                        return <option value={state.id}> {state.name}</option>
                                    })
                                }
                            </select>
                            <span>Oficina ubicada en:</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("imag")} type="file" form='form-addUser' id='submit-photo' />
                            <span>Seleccionar un archivo</span>
                        </div>
                    </div>


                    <input className='register__texts-submitForm' type="submit" value='Enviar' />
                </form>


            </section>

            <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
                {/* <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--hover">Cancel</Link> */}
                <Link to="/dashboard/contacto" className="register__button-mod register__button-mod--styleColor">Next</Link>
            </div>
        </>
    )
}
