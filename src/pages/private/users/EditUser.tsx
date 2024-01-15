import { Link, useParams } from 'react-router-dom';
import { BloodType, Contact, User } from '../../../api/interfaces/users';
import { useRoles, useStates, useUpDateUser, useUser, useUsers } from '../../../hooks/user';
import { SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
    id: string;
    name: string;
    position: string;
    phone: string;
    birthdate: Date;
    curp: string;
    address: string;
    bloodType: BloodType;
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

export const EditUser = () => {

    const { id } = useParams<{ id: string }>();
    const { data, isPending } = useUser(id!);

    return (
        <>
            {
                isPending
                    ?
                    <span>Cargando...</span>
                    :

                    <FormUser data={data!} id={id!} />
            }

        </>
    )
}

interface Props {
    id: string,
    data: User
}

export default function FormUser({ data, id }: Props) {
    const { data: users } = useUsers();

    const {
        register,
        handleSubmit,

    } = useForm<Inputs>({
        defaultValues: {
            id: data.id,
            name: data.name,
            position: data.position,
            birthdate: data.birthdate,
            phone: data?.phone,
            curp: data.curp,
            address: data?.address,
            bloodType: data.bloodType,
            allergies: data?.allergies,
            nss: data?.nss,
            cuip: data?.cuip,
            idChief: data.userChief?.id,
            rol: data.rol,
            idState: data.state.id
        }
    })

    const { mutate } = useUpDateUser();

    const onSubmit: SubmitHandler<Inputs> = (dataForm) => {

        const dataSend = {};
        if (dataForm.id !== data.id) dataSend.id = dataForm.id;
        if (dataForm.name !== data.name) dataSend.name = dataForm.name;
        if (dataForm.position !== data.position) dataSend.position = dataForm.position;
        if (dataForm.birthdate !== data.birthdate) dataSend.birthdate = dataForm.birthdate;
        if (dataForm.phone !== data.phone) dataSend.phone = dataForm.phone;
        if (dataForm.curp !== data.curp) dataSend.curp = dataForm.curp;
        if (dataForm.address !== data.address) dataSend.address = dataForm.address;
        if (dataForm.bloodType !== data.bloodType) dataSend.bloodType = dataForm.bloodType;
        if (dataForm.allergies !== data.allergies) dataSend.allergies = dataForm.allergies;
        if (dataForm.nss !== data.nss) dataSend.nss = dataForm.nss;
        if (dataForm.cuip !== data.cuip) dataSend.cuip = dataForm.cuip;
        if (dataForm.idChief !== data.userChief?.id) dataSend.idChief = dataForm.idChief;
        if (dataForm.rol !== data.rol) dataSend.rol = dataForm.rol;
        if (Number(dataForm.idState) !== data.state.id) dataSend.idState = dataForm.idState;


        console.log(dataSend);

        // const { imag, ...rest } = data;
        const formData = new FormData();
        formData.append("data", JSON.stringify({ ...dataSend }))

        console.log(dataForm.imag);

        formData.append("imag", dataForm.imag[0])

        mutate({ id: id!, data: formData })
    }

    const { data: states } = useStates();
    const { data: roles } = useRoles();

    return (
        <>
            {/* <section className="container__info">
                <h2 className="container__info-title">Edición del usuario: {data?.name}</h2>
                <Link to="/dashboard/usuarios">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </Link>
            </section> */}


            <section className="register">
                <div className='register__photo'>
                    <img className="register__img" src={data.urlPhoto} alt="photo-user" />
                </div>

                <form className='register__texts' onSubmit={handleSubmit(onSubmit)}>

                    {/* <div className='register__texts register__texts--addUser'> */}
                        <div className='register__texts-inputBox'>
                            <input {...register("id")} type="text" />
                            <span >ID de empleado</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("name")} type="text" />
                            <span >Nombre de usuario</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("position")} type="text" />
                            <span >Puesto</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("birthdate")} type="date" />
                            <span >Fecha de nacimiento:</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("phone")} type="number" />
                            <span >Teléfono</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("curp")} type="text" />
                            <span >CURP</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("address")} type="text" />
                            <span >Dirección </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("bloodType")}>
                                {
                                    Object.values(BloodType).map((key) => (
                                        <option selected={data.bloodType == key} value={key}>{(key == "" ? "No registrado" : key)}</option>
                                    ))
                                }

                            </select>
                            <span >Tipo de sangre</span>

                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("allergies")} type="text" />
                            <span >Alergias </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("nss")} type="text" />
                            <span >NSS </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("cuip")} type="text" />
                            <span >CUIP </span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("idChief")} id="jefe-directo">
                                {
                                    users?.map(user => {
                                        return <option selected={data.userChief?.id == user.id} value={user.id}>{user.name}</option>
                                    })
                                }
                            </select>
                            <span>Jefe directo</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("rol")} id="rol-empleado">
                                {
                                    roles?.map(rol => {
                                        return <option selected={data.rol.toLowerCase() == rol.toLowerCase()} value={rol}>{rol}</option>
                                    })
                                }
                            </select>
                            <span>Rol del usuario</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <select {...register("idState")} id="state">
                                {
                                    states?.map(state => {
                                        return <option selected={data.state.id == state.id} value={state.id}> {state.name}</option>
                                    })
                                }
                            </select>
                            <span>Oficina ubicada en:</span>
                        </div>

                        <div className='register__texts-inputBox'>
                            <input {...register("imag")} type="file" form='form-addUser' id='submit-photo' />
                            <span>Seleccionar un archivo</span>
                        </div>

                    {/* </div> */}

                    <div className='register__texts register__texts'>
                        <input className='register__texts-submitForm' type="submit" value='Guardar cambios' />
                    </div>



                </form>

            </section>

            {/* <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
            </div> */}
        </>
    )
}

