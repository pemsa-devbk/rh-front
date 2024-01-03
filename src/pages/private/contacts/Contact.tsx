import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreateContact, useUser } from "../../../hooks/user";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    contact: string
    type: number
    notes: string
}

export default function Contact() {
    
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, refetch } = useUser(id!);

    const {
        register,
        handleSubmit,
    } = useForm<Inputs>()

    const { mutate } = useCreateContact();


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


    return (
        <>
            <section className="title">
                <h2 className="title__container">Creación de contacto para: {data?.name}</h2>
            </section>
            <section className="register register--registerContact">
                <div className=" register__texts register__texts--textsContact">
                    {
                        data?.contacts?.map((contact, idx) => (

                            <div key={contact.id} className="register__texts-username register__texts-username--contacts">
                                <section className="register__texts-username register__texts-username--contContactos">
                                    <p className="register__texts-contact register__texts-contact--title">Contact {idx + 1}: {contact.notes} </p>
                                    <br />
                                    <p className="register__texts-contact">Type contact: {contact.type == 1 ? "Correo" : "Número"} </p>
                                    <p className="register__texts-contact">Contacto: {contact.contact}</p>
                                </section>

                                <section className="register__texts-username register__texts-username--optionContact">
                                    <svg id="svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="m18.988 2.012 3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287-3-3L8 13z"></path><path d="M19 19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2V19z"></path></svg>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg>

                                </section>
                            </div>
                        ))
                    }
                </div>

                <form className="register__texts register__texts--textsContact2" onSubmit={handleSubmit(onSubmit)}>
                    <select {...register("type")} className="register__texts-username" name="type-contact" id="type-contact">
                        <option disabled>Tipo de contacto </option>
                        <option value={1}>1. Correo </option>
                        <option value={2}>2. Teléfono </option>
                    </select>
                    <input {...register("contact")} className="register__texts-username" type="text" placeholder="Contacto" />
                    <textarea {...register('notes')} name="notes" id="description" placeholder="Descripción del contacto:"></textarea>
                    <input type="submit" className="register__button-mod register__button-mod--saveButton" value="save" />
                    {/* <Link to="/dashboard/usuarios" className="register__button-mod register__button-mod--saveButton">Save</Link> */}
                </form>
            </section>

            <div className="register__button" >
                <button className="register__button-mod register__button-mod--hover" onClick={() => navigate(-1)}>Cancel</button>
                {/* <Link to="/dashboard/registro" >Cancel</Link> */}
                <Link to="/dashboard/contacto" className="register__button-mod register__button-mod--styleColor">Next</Link>
            </div>
        </>
    )
}
