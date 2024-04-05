import { Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../UserContext";
const Logout = () => {
    // it clears or removes all the content of our localStorage
    // localStorage.clear();
    const { unSetUser } = useContext(UserContext);
    useEffect(() => {
        unSetUser();
    }, []);

    return <Navigate to="/login" />;
}

export default Logout;