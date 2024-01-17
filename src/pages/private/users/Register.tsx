import { SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { BloodType } from '../../../api/interfaces/users';
import { useCreateUser, useUsers } from '../../../hooks/user';
import photoUser from '../../../img/icon/circle-user.png';
import { useState } from 'react';
import { useRoles, useStates } from '../../../hooks/general';

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
    bloodType: BloodType;
    allergies: string;
    nss: string;
    cuip: string;
    password: string;
    rol: string;
    idChief: string;
    idState: number;
    contacts: Contact[];
    img: FileList;
    firma: FileList;
    gender: string;
}

export default function Register() {

    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
    const { data: users } = useUsers();

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Inputs>({
        defaultValues:{
            bloodType: undefined
        },

    })


    const { mutate } = useCreateUser();

    const onSubmit: SubmitHandler<Inputs> = (data) => {

        const datosFiltrados: Partial<Inputs> = Object.entries(data).reduce(
            (acc: Partial<Inputs>, [key, value]) => {
                if (value !== '') {
                    acc = { ...acc, [key as keyof Inputs]: value};
                }
                return acc;
            },
            {}
        );
        const { img, firma, ...rest } = datosFiltrados;
        const formData = new FormData();
        formData.append("data", JSON.stringify({ ...rest, idState: Number(rest.idState), contacts: [] }))
        formData.append("img", img![0])
        formData.append("firma", firma![0])

        mutate(formData, {
            onSuccess(data) {
                Swal.fire({
                    title: "Usuario creado",
                    icon: 'success',
                    text: `El usuario ${data.user.name} fue creado.`
                })
                reset();
            },
        })
    }

    const { data: states } = useStates();
    const { data: roles } = useRoles();

    const handleImagenSeleccionada = (event: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = event.target.files?.[0];

        if (archivo) {
            const lector = new FileReader();

            lector.onloadend = () => {
                // Cuando la lectura del archivo esté completa, establecemos la imagen en el estado
                setImagenSeleccionada(lector.result as string);
            };

            lector.readAsDataURL(archivo);
        }
    };

    return (
        <>

            <section className="register">

                <div className="register__photo">
                    <img className="register__img" src={imagenSeleccionada ? imagenSeleccionada : photoUser} alt="photo-user" />
                </div>

                <form className="register__texts" name='form-addUser' onSubmit={handleSubmit(onSubmit)}>
                    <div className='register__texts-inputBox'>
                        <input {...register("id")} type="text" required />
                        <label>ID de empleado </label>
                    </div>
                    <div className='register__texts-inputBox'>
                        <input {...register("name")} type="text" required />
                        <label >Nombre del usuario</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("position")} type="text" required />
                        <label >Puesto</label>
                    </div>

                    {/*  */}
                    <div className='register__texts-inputBox'>
                        <select {...register("gender")} id="gender" defaultValue={undefined}>
                            <option hidden value="">Seleccione uno</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        <label>Genero</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("password")} type="text" required />
                        <label >Contraseña </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("birthdate")} type="date" required />
                        <label >Fecha de nacimiento:</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("phone")} type="number" />
                        <label >Teléfono</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("curp")} type="text" required />
                        <label >CURP</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("address")} type="text" />
                        <label >Dirección </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("bloodType")} id="bloodType" defaultValue={undefined}>
                            <option hidden value="">Seleccione un tipo</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        <label>Tipo de sangre</label>
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
                        <select {...register("idChief")} id="idChief" defaultValue={undefined} required>
                            <option hidden value="">Seleccione un usuario</option>
                            {
                                users?.map(user => {
                                    return <option key={user.id} value={user.id}>{user.name}</option>
                                })
                            }
                        </select>
                        <label>Jefe directo</label>
                    </div>

                    <div className='register__texts-inputBox'>

                        <select {...register("rol")} id="rol-empleado" required>
                            <option hidden value="">Seleccione un rol</option>
                            {
                                roles?.map( rol => {
                                    return <option key={rol[0]} value={rol[0]}>{rol[1]}</option>
                                })
                               
                            }
                        </select>
                        <label>Rol del usuario</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("idState")} id="state" required>
                            <option hidden value="">Seleccione un estado</option>
                            {
                                states?.map(state => {
                                    return <option key={state.id} value={state.id}> {state.name}</option>
                                })
                            }
                        </select>
                        <label>Región:</label>
                    </div>

                    <div className='register__texts-inputBox register__texts-inputBox--img'>
                        {/* TODO required */}
                        <input {...register("img")} onChange={handleImagenSeleccionada} type="file"  id='submit-photo' required />
                        <label htmlFor='submit-photo'>Subir foto</label>
                    </div>

                    <div className='register__texts-inputBox register__texts-inputBox--img'>
                        {/* TODO required */}
                        <input {...register("firma")} type="file" id='submit-firma' required />
                        <label htmlFor='submit-firma'>Subir firma</label>
                    </div>
                    {/* </div> */}


                    <div className='register__save'>
                        <input className='register__texts-submitForm'
                            type="submit" value='Guardar'
                            
                        />
                    </div>
                </form>



            </section>
        </>
    )

}

