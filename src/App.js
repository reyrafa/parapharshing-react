import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toolbox from "./components/Toolbox";
import { useEffect, useState } from "react";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import NotFoundPage from "./components/NotFoundPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
function App() {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        emailVerified: null,
    });
    const [loading, setLoading] = useState(true);
    const unSetUser = () => {
        setUser({
            id: null,
            isAdmin: null,
            emailVerified: null,
        });
        localStorage.clear();
    };

    const fetchDetails = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/user/details`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        const result = await response.json();

        if (response.ok) {
            setUser({
                id: result.user._id,
                isAdmin: result.user.isAdmin,
            });
        } else {
            setUser({
                id: null,
                isAdmin: null,
                emailVerified: null,
            });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            fetchDetails();
        }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);
    document.body.style.backgroundColor = "#FBFBF1";

    return (
        <>
            <UserProvider value={{ user, setUser, unSetUser }}>
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <p>loading..</p>
                    </div>
                ) : (
                    <Router>
                        <NavBar />
                        <Routes>
                            <Route path="/" element={<Toolbox />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/logout" element={<Logout />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Router>
                )}
            </UserProvider>
        </>
    );
}

export default App;
