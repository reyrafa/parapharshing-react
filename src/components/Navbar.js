import { useContext } from "react";
import {
    Navbar,
    Container,
    Nav,
    Form,
    Row,
    Col,
    Button,
} from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import UserContext from "../UserContext";
import logo from "../assets/images/FILCOMPREHEND LOGO.png";

function NavBar() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";
    const isProductPage = location.pathname === "/products";

    const backgroundColor = "#939384";
    const textColor = "#F6F6DF";
    return (
        <>
            <Navbar
                expand="lg"
                className=""
                style={{ background: backgroundColor }}
            >
                <Container>
                    <Navbar.Brand
                        className="d-flex align-items-center"
                        as={NavLink}
                        to={"/"}
                    >
                        <img
                            src={logo}
                            alt="eCommerce"
                            className="img-fluid"
                            style={{ width: "70px" }}
                        />
                        <h2 style={{ color: textColor }}>FilComprehend</h2>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {!isLoginPage && !isRegisterPage && (
                            <>
                                <Nav className="ms-auto gap-0 gap-lg-3">
                                    <Nav.Link
                                        as={NavLink}
                                        to={"/"}
                                        style={{ color: textColor }}
                                    >
                                        Home
                                    </Nav.Link>

                                    {user.id && user.isAdmin && (
                                        <>
                                            <Nav.Link
                                                style={{ color: textColor }}
                                                as={NavLink}
                                                to={"/users"}
                                            >
                                                User Management
                                            </Nav.Link>
                                        </>
                                    )}

                                    {user.id === null ? (
                                        <>
                                            <Nav.Link
                                                as={NavLink}
                                                to={"/login"}
                                                style={{ color: textColor }}
                                            >
                                                Login
                                            </Nav.Link>
                                            <Nav.Link
                                                style={{ color: textColor }}
                                                as={NavLink}
                                                to={"/register"}
                                            >
                                                Sign Up
                                            </Nav.Link>
                                        </>
                                    ) : (
                                        <>
                                            <Nav.Link
                                                style={{ color: textColor }}
                                                as={NavLink}
                                                to={"/logout"}
                                            >
                                                Logout
                                            </Nav.Link>
                                        </>
                                    )}
                                </Nav>
                            </>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default NavBar;
