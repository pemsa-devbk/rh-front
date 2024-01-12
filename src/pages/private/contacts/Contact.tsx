import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Contact } from "../../../api/interfaces/users";
import { useCreateContact, useDeleteContact, useUser } from "../../../hooks/user";

type Inputs = {
    contact: string
    type: number
    notes: string
}




// const { value: formValues } = await Swal.fire({
//     title: "Multiple inputs",
//     html: `
//       <input id="swal-input1" class="swal2-input">
//       <input id="swal-input2" class="swal2-input">
//     `,
//     focusConfirm: false,
//     preConfirm: () => {
//         return [
//             document.getElementById("swal-input1").value,
//             document.getElementById("swal-input2").value
//         ];
//     }
// });
// if (formValues) {
//     Swal.fire(JSON.stringify(formValues));
// }

export default function Contacts() {

    const { id } = useParams<{ id: string }>();
    const { data, refetch } = useUser(id!);

    const {
        register,
        handleSubmit,
    } = useForm<Inputs>()

    const { mutate } = useCreateContact();
    // const { mutate: actualizaContact } = useUpDateContact();
    const { mutate: eliminaContacto } = useDeleteContact();


    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const dataToSend = { ...data, type: Number(data.type) };
        console.log(dataToSend);

        mutate({ id: id!, data: dataToSend },
            {
                onSuccess() {
                    refetch()
                },
            });

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
                    eliminaContacto(contact.id, {
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

    const hClick = () => {
        // if(value!== ){

        // }
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha creado un nuevo contacto ",
            showConfirmButton: false,
            timer: 2500
        });
    }




    return (
        <>
            <section className="container__info">
                <h2 className="container__info-title">Creación de contacto para: {data?.name}</h2>
                <Link to="/dashboard/usuarios">
                    <svg className="container__info-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path className='container__info-icon' d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
                </Link>
            </section>

            <section className="register register--registerContact">

                <form className="register__texts register__texts--textsContact2" onSubmit={handleSubmit(onSubmit)}>
                    <select {...register("type")} className="register__texts-username register__texts-username--nameContact" name="type" id="type-contact">
                        <option disabled>Tipo de contacto </option>
                        <option value={1}>1. Correo </option>
                        <option value={2}>2. Teléfono </option>
                    </select>
                    <input {...register("contact")} className="register__texts-username register__texts-username--nameContact" type="text" placeholder="Contacto" required />
                    <textarea {...register('notes')} name="notes" id="description" placeholder="Descripción del contacto:" required></textarea>
                    <input onClick={() => hClick()} type="submit" className="register__button-mod register__button-mod--saveButton" value="save" />
                    {/* <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--saveButton">Save</Link> */}
                </form>


                <div className=" register__texts register__texts--textsContact">
                    {
                        data?.contacts?.map((contact) => (

                            <div key={contact.id} className="register__texts-username register__texts-username--contacts">
                                <section className="register__texts-username register__texts-username--regSectionContactos">
                                    
                                    <div className='register__texts-username register__texts-username--registerContact1'>
                                        <p className="register__texts-contact register__texts-contact--sectionTitle">Contact {contact.id}</p>
                                        <p className="register__texts-contact register__texts-contact--sectionsubtitle">{contact.notes} </p>
                                    </div>

                                    <div className='register__texts-username register__texts-username--registerContact2'>
                                        <p className="register__texts-contactSection">Type contact: {contact.type == 1 ? "Correo" : "Número"} </p>
                                        <p className="register__texts-contactSection"> Contacto: {contact.contact}</p>
                                    </div>
                                </section>

                                <section className="register__texts-username register__texts-username--optionContact">
                                    <svg id="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>

                                    <svg onClick={() => handClick(contact)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg>

                                </section>
                            </div>
                        ))
                    }
                </div>


            </section>

            {/* <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
                <Link to="/dashboard/contacto" className="register__button-mod register__button-mod--styleColor">Next</Link>
            </div> */}
        </>
    )
}
