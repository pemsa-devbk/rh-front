
import { Navigate } from 'react-router-dom';
import logo from '../../../assets/logo_pem.png'

import { useAuthStore } from '../../../store/auth/auth.store';
import { useForm,SubmitHandler } from 'react-hook-form';

type Inputs = {
    id: string
    password: string
}


export const Login = () => {
    
    const login = useAuthStore(state => state.login);
    const status = useAuthStore(state => state.status);
    const checkStatus = useAuthStore(state => state.checkStatus);

    const {
        register,
        handleSubmit,
       
      } = useForm<Inputs>()


      const onSubmit: SubmitHandler<Inputs> = (data) => {

        login(data.id, data.password)
      }

      if(status=="Pendiente"){
        checkStatus();
        return <p>cargando</p>
      }

      if(status=="Logueado"){
        return <Navigate to='/dashboard/home'/>
      }


    return (
        <main className="card">
            <form className="card__texts" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="card__title">Gestión de usuario</h1>
                <input {...register("id")} className="card__username" placeholder="Nombre de usuario" type="text" />
                <input {...register("password")} className="card__username" placeholder="Contraseña" type="password" />

                <button className="card__submit" type="submit">Log in</button>
            </form>

            <figure className="card__picture">
                <img className="card__img" src={logo} alt=" " />
            </figure>
        </main>
    )
}
