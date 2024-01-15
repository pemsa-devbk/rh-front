import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BloodType } from '../../../api/interfaces/users';
import { useCreateUser, useRoles, useStates, useUsers } from '../../../hooks/user';
import photoUser from '../../../img/icon/circle-user.png';
import { useState } from 'react';

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

    const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);
    const { data: users } = useUsers();

    const {
        register,
        handleSubmit,
        getValues
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

    // const handClick = (user: User) => {
    //     Swal.fire({
    //         title: "Verifique todos los campos se han llenado correctamente para crear el usuario correctamente",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Si, enviar datos"
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             {
    //                 mutate( , {
    //                     onSuccess: () => {
    //                         Swal.fire({
    //                             title: "Se ha creado un nuevo usuario",
    //                             text: `El usuario: ${user.name} ha creó con éxito`,
    //                             icon: "success"
    //                         });
    //                     }
    //                 })

    //             }

    //         }
    //     });

    // }

    const handClick = () => {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "El usuario se ha creado con éxito",
            showConfirmButton: false,
            timer: 1500
        });
    }

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
            {/* <section className="container__info">
                <h2 className="container__info-title">Creación de usuario:</h2>
                <Link to="/dashboard/usuarios">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </Link>
            </section> */}

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

                    <div className='register__texts-inputBox'>
                        <input {...register("password")} type="text" required />
                        <label >Contraseña </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("birthdate")} type="date" />
                        <label >Fecha de nacimiento:</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("phone")} type="number" required />
                        <label >Teléfono</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("curp")} type="text" required />
                        <label >CURP</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <input {...register("address")} type="text" required />
                        <label >Dirección </label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("bloodType")} id="tipoSangre">
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
                        <input {...register("allergies")} type="text" required />
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
                            {
                                users?.map(user => {
                                    return <option value={user.id}>{user.name}</option>
                                })
                            }
                        </select>
                        <label>Jefe directo</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("rol")} id="rol-empleado">
                            {
                                roles?.map(rol => {
                                    return <option value={rol}>{rol}</option>
                                })
                            }
                        </select>
                        <label>Rol del usuario</label>
                    </div>

                    <div className='register__texts-inputBox'>
                        <select {...register("idState")} id="state">
                            {
                                states?.map(state => {
                                    return <option value={state.id}> {state.name}</option>
                                })
                            }
                        </select>
                        <label>Oficina ubicada en:</label>
                    </div>

                    <div className='register__texts-inputBox register__texts-inputBox--img'>
                        <input {...register("imag")} onChange={handleImagenSeleccionada} type="file"  id='submit-photo' />
                        <label htmlFor='submit-photo'>Seleccionar un archivo</label>
                    </div>
                    {/* </div> */}


                    <div className='register__save'>
                        <input onClick={() => handClick()} className='register__texts-submitForm'
                            type="submit" value='Guardar'
                            
                        />
                    </div>
                </form>



            </section>

            {/* <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
                <Link to="/dashboard/contacto" className="register__button-mod register__button-mod--styleColor">Next</Link>
            </div> */}
        </>
    )

}

