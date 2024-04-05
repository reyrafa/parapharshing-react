import { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [design, setDesign] = useState([]);
    const [passwordError, setPasswordError] = useState("none");
    const [emailError, setEmailError] = useState("none");

    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (email !== "" && password !== "") {
            setDesign({
                cursor: "pointer",
                opacity: 1,
            });
            setEmailError("none");
            setPasswordError("none");
        } else {
            setDesign({
                cursor: "not-allowed",
                opacity: 0.5,
            });
        }
    }, [email, password]);

    const Login = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/user/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                }
            );
            const result = await response.json();

            if (response.ok) {
                if (result.accessToken) {
                    localStorage.setItem("token", result.accessToken);
                    loggedUser(result.accessToken);
                    Swal.fire({
                        title: "Logged Successfull",
                        icon: "success",
                    });
                    setEmail("");
                }
            } else {
                Swal.fire({
                    title: "Login Failed",
                    icon: "error",
                    text: result.message,
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Failed Registration",
                icon: "error",
                text: "An unexpected error occurred. Please try again later.",
            });
        }

        setPassword("");
    };

    const loggedUser = async (accessToken) => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/user/details`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const result = await response.json();

        if (response.ok) {
            setUser({
                id: result.user._id,
                isAdmin: result.user.isAdmin,
               
            });
        }
    };
    const backgroundColor = "#939384";
    const textColor = "#626258";

    return (
        <>
            {user.id !== null ? (
                <Navigate to={"/"} />
            ) : (
                <div style={{ overflow: "hidden" }}>
                    <Row className="">
                        <Col className="col-md-5 mx-auto">
                            <h5
                                className="text-center mt-5"
                                style={{ color: textColor }}
                            >
                                Log in to your FilComprehend account
                            </h5>
                            <Form
                                className="p-4 m-4 bg-white rounded-1"
                                onSubmit={(event) => {
                                    Login(event);
                                }}
                            >
                                {/*Form Group for email*/}
                                <Form.Group
                                    className="mb-3"
                                    controlId="loginEmail"
                                >
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        required
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            if (event.target.value === "") {
                                                setEmailError("block");
                                            } else {
                                                setEmailError("none");
                                            }
                                        }}
                                        style={{
                                            boxShadow: "none",
                                        }}
                                    />
                                    <span
                                        className="text-danger"
                                        style={{
                                            fontSize: "0.8em",
                                            display: emailError,
                                        }}
                                    >
                                        Please Enter your Email*
                                    </span>
                                </Form.Group>

                                {/*FormGroup for password*/}
                                <Form.Group
                                    className="mb-3"
                                    controlId="loginPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        style={{ boxShadow: "none" }}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            if (event.target.value === "") {
                                                setPasswordError("block");
                                            } else {
                                                setPasswordError("none");
                                            }
                                        }}
                                    />
                                    <span
                                        className="text-danger"
                                        style={{
                                            fontSize: "0.8em",
                                            display: passwordError,
                                        }}
                                    >
                                        Please Enter your Password*
                                    </span>
                                </Form.Group>
                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        style={{
                                            cursor: design.cursor,
                                            opacity: design.opacity,
                                        }}
                                    >
                                        LOG IN
                                    </Button>
                                </div>
                                <div className="d-flex justify-content-center mt-4 text-secondary">
                                    <p>No Account Yet?</p>
                                    <Link
                                        className="text-decoration-none text-success ms-1"
                                        to={"/register"}
                                    >
                                        SIGN UP
                                    </Link>
                                </div>
                            </Form>
                            <div
                                style={{ fontSize: "12px" }}
                                className="text-center"
                            >
                                By continuing you agree to
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        marginLeft: "2px",
                                    }}
                                >
                                    Terms of Service
                                </Link>{" "}
                                and have read our
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        marginLeft: "2px",
                                    }}
                                >
                                    Privacy Policy
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
}

export default Login;
