import{useUser} from '@clerk/clerk-react';
import { Navigate,useLocation } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
  const {isSignedIn,user,isLoaded} =useUser();
  const {pathname} = useLocation();




export default ProtectedRoute
