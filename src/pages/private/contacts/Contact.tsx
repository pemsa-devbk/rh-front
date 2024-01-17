import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Contact } from "../../../api/interfaces/users";
import { ValidContact } from "../../../api/interfaces/request/contact";
import { useUser } from "../../../hooks/user";
import { useCreateContact, useDeleteContact, useUpDateContact } from "../../../hooks/contact";

type Inputs = {
    contact: string;
    type: ValidContact;
    notes: string;
    isEdit: boolean;
    id: number;
}


export default function Contacts() {

    const { id } = useParams<{ id: string }>();
    const { data, refetch } = useUser(id!);

    const {
        register,
        handleSubmit,
        reset,
        setValue
    } = useForm<Inputs>({
        defaultValues: {
            isEdit: false
        }
    })

    const { mutate } = useCreateContact();
    const { mutate: actualizaContact } = useUpDateContact();
    const { mutate: eliminaContacto } = useDeleteContact();


    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const {id: idContact, isEdit, ...restData} = data;
        const dataToSend = { ...restData, type: Number(restData.type) };
        console.log(dataToSend);
        
        if(isEdit){

            actualizaContact({ id: idContact, data:dataToSend},{
                onSuccess() {
                    Swal.fire({
                        position: 'bottom-right',
                        text: 'Contacto actualizado'
                    })
                    reset();
                    refetch();
                },
            })
        }else{
            mutate({ id: id!, data: dataToSend },
                {
                    onSuccess() {
                        Swal.fire({
                            position: 'bottom-right',
                            text: 'Contacto guardado'
                        })
                        reset();
                        refetch();
                    },
                });

        }


    }


    const handClick = (contact: Contact) => {
        Swal.fire({
            title: "¿Desea eliminar el contacto?",
            text: `${contact.contact}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar contacto",
        }).then((result) => {
            if (result.isConfirmed) {
                if (contact) {
                    eliminaContacto(contact.id.toString(), {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Eliminación de contacto!",
                                text: "Se ha eliminado el contacto con éxito: ",
                                icon: "success"
                            });
                            refetch();
                        },
                        onError(error) {
                            Swal.fire({
                                title: error.message,
                                icon: 'error'
                            })
                        }
                    })
                }
            }
        });
    }

    const hClick = (contact: Contact) => {
        setValue('contact', contact.contact)
        setValue('type', contact.type)
        setValue('notes', contact.notes)
        setValue('isEdit', true)
        setValue('id', contact.id)
    }




    return (
        <>
            {/* <section className="container__info">
                <h2 className="container__info-title">Creación de contacto para: {data?.name}</h2>
                <Link to="/dashboard/usuarios">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </Link>
            </section> */}

            {/* <section className="register register--registerContact"> */}

            <form className="formcontact" onSubmit={handleSubmit(onSubmit)}>

                <div className="register__texts-inputBox">
                    <select {...register("type")} className="register__texts-username register__texts-username--nameContact" name="type" id="type-contact" required>
                        <option disabled>Tipo de contacto </option>
                        <option value={1}>1. Correo </option>
                        <option value={2}>2. Teléfono </option>
                    </select>
                    <label htmlFor="">Tipo de contacto</label>
                </div>

                <div className="register__texts-inputBox">
                    <input {...register("contact")} type="text" required />
                    <label htmlFor="">Contacto</label>
                </div>

                <div className="register__texts-inputBox">
                    <textarea {...register('notes')} name="notes"  ></textarea>
                    <label htmlFor="">Descripción del contacto:</label>
                </div>
                <div className="register__save">
                    <input type="submit" className="register__texts-submitForm" value="Guardar" />

                </div>

            </form>


            <div className="listcontact">
                {
                    data?.contacts?.map((contact) => (
                        <div key={contact.id} className="contact">
                            <p className="contact__title">{contact.contact}</p>
                            <div className="contact__info">
                                <p>{(contact.type === 1) ? 'Correo' : 'Telefono'}</p>
                                <p>{contact.notes}</p>
                            </div>
                            <div className="contact__actions">
                                <svg onClick={() => hClick(contact)} id="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>

                                <svg onClick={() => handClick(contact)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg>
                            </div>


                        </div>
                    ))
                }
            </div>


            {/* </section> */}

            {/* <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
                <Link to="/dashboard/contacto" className="register__button-mod register__button-mod--styleColor">Next</Link>
            </div> */}
        </>
    )
}
