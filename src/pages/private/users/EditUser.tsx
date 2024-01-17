import { useParams } from 'react-router-dom';
import { useUpDateUser, useUser, useUsers } from '../../../hooks/user';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BloodType, User } from '../../../api/interfaces/response/user';
import { CreateContact } from '../../../api/interfaces/request/contact';
import Swal from 'sweetalert2';
import { useRoles, useStates } from '../../../hooks/general';

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
    cuip: string | null;
    password: string;
    rol: string;
    idChief: string;
    idState: number;
    contacts: CreateContact[];
    img: FileList;
    firma: FileList;
    gender: string;
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
            phone: data.phone,
            curp: data.curp,
            address: data.address,
            bloodType: data.bloodType,
            allergies: data.allergies || '',
            nss: data.nss || '',
            cuip: data.cuip,
            idChief: data.userChief?.id,
            rol: data.rol,
            idState: data.region.id
        }
    })

    const { mutate } = useUpDateUser();

    const onSubmit: SubmitHandler<Inputs> = (dataForm) => {


        const { img, firma, idChief, idState, ...moreInfo } = dataForm;

        const dataSend: Partial<Inputs> = Object.entries(moreInfo).reduce((acc: Partial<Inputs>, [key, value]) => {

            if (!data[key as keyof User]) {
                if (!value) {
                    return acc;
                }
            }

            if (data[key as keyof User] != value) {
                acc = { ...acc, [key]: value }
            }
            return acc;
        }, {} as Partial<Inputs>);
        if (idChief !== data.userChief?.id) dataSend.idChief = idChief;
        if (Number(idState) !== data.region.id) dataSend.idState = Number(idState);

        const formData = new FormData();
        formData.append("data", JSON.stringify({ ...dataSend }))
        if (img.length === 1) formData.append("img", img[0]);
        if (firma.length === 1) formData.append("firma", firma[0]);

        mutate({ id: id!, data: formData }, {
            onSuccess() {
                Swal.fire({
                    title: `Usuario actualizado`,
                    icon: 'success',
                })
            },
        })
    }

    const { data: states } = useStates();
    const { data: roles } = useRoles();

    return (
        <>


            <section className="register">
                <div className='register__photo'>
                    <img className="register__img" src={data.urlPhoto} alt="photo-user" />
                </div>

                <form className='register__texts' onSubmit={handleSubmit(onSubmit)}>

                    {/* <div className='register__texts register__texts--addUser'> */}
                    <div className='register__texts-inputBox'>
                        <input {...register("id")} type="text" />
                        <label >ID de empleado</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("name")} type="text" />
                        <label >Nombre de usuario</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("position")} type="text" />
                        <label >Puesto</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("gender")} id="gender" defaultValue={undefined}>
                            <option hidden value="">Seleccione uno</option>
                            <option value="M" selected={data.gender==='M'}>Masculino</option>
                            <option value="F" selected={data.gender === 'F'}>Femenino</option>
                        </select>
                        <label>Genero</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("birthdate")} type="date" />
                        <label >Fecha de nacimiento:</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("phone")} type="number" />
                        <label >Teléfono</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("curp")} type="text" />
                        <label >CURP</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("address")} type="text" />
                        <label >Dirección </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("bloodType")} id='bloodType' value={data.bloodType}>
                            <option hidden value="">Seleccione un tipo</option>
                            {
                                    Object.values(BloodType).map((key) => (
                                        <option key={key} selected={data.bloodType == key} value={key}>{key}</option>
                                    ))
                                }
                        </select>
                        <label >Tipo de sangre</label>

                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("allergies")} type="text" />
                        <label >Alergias </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("nss")} type="text" />
                        <label >NSS </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("cuip")} type="text" />
                        <label >CUIP </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("idChief")} id="jefe-directo">
                            <option hidden value="">Seleccione un usuario</option>
                            {
                                users?.map(user => {
                                    return <option key={user.id} selected={data.userChief?.id == user.id} value={user.id}>{user.name}</option>
                                })
                            }
                        </select>
                        <label>Jefe directo</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("rol")} id="rol-empleado">

                            <option disabled value="" selected>Seleccione un rol</option>
                            {
                                roles?.map(rol => {
                                    return <option selected={data.rol === rol[0]} key={rol[0]} value={rol[0]}>{rol[1]}</option>
                                })

                            }
                        </select>
                        <label>Rol del usuario</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("idState")} id="state">
                            {
                                states?.map(state => {
                                    return <option key={`state-${state.id}`} selected={data.region.id == state.id} value={state.id}> {state.name}</option>
                                })
                            }
                        </select>
                        <label>Region:</label>
                    </div>

                    <div className='register__texts-inputBox register__texts-inputBox--img'>
                        <input {...register("img")} type="file" form='form-addUser' id='submit-photo' />
                        <label htmlFor='submit-photo'>Seleccionar un archivo</label>
                    </div>

                    <div className='register__texts-inputBox register__texts-inputBox--img'>
                        <input {...register("firma")} type="file" form='form-addUser' id='submit-firma' />
                        <label htmlFor='submit-firma'>Seleccionar un archivo</label>
                    </div>

                    {/* </div> */}

                    <div className='register__save'>
                        <input className='register__texts-submitForm' type="submit" value='Guardar cambios' />
                    </div>

                </form>

            </section>
        </>
    )
}

