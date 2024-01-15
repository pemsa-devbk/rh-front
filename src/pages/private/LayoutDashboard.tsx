import { Navigate, Outlet } from "react-router-dom"
// import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Navbar from "../../components/Navbar"
import { useAuthStore } from "../../store/auth/auth.store"


export const LayoutDashboard = () => {

  const status = useAuthStore(state => state.status);
  const checkStatus = useAuthStore(state => state.checkStatus);

  if(status=="Pendiente"){
    checkStatus();
    return <p>Cargando</p>
  }

  if(status=="NoAutorizado"){
    return <Navigate to="/login"/>
  }

  return (
    <div className="home">

        <Navbar/>

        <main className="main">
          <Header/>
          
            <Outlet/>

          {/* <Footer/> */}
        </main>
    </div>
  )
}
