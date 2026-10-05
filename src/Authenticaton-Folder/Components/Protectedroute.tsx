import { UseAuth } from "../Authentication/CreateContext";
import {Navigate} from "react-router-dom"
interface Props{
    children:React.ReactNode
}
const ProtectedRoute=({children}:Props)=>{
    const {isAuthenticated}=UseAuth()
    if(!isAuthenticated){
        return <Navigate to="/login"/>
    }
    return children
     
}
export default ProtectedRoute