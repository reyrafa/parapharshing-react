import { useContext, useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, Link, Navigate } from "react-router-dom";
import UserContext from "../UserContext";
import Swal from "sweetalert2";

function Register() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [buttonText, setButtonText] = useState("REGISTER");

    useEffect(() => {
        if (
            name !== "" &&
            email !== "" &&
            password !== "" &&
            rePassword !== ""
        ) {
            if (password !== rePassword) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        } else {
            setIsDisabled(true);
        }
    }, [name, email, password, rePassword]);

    const registerUser = async (event) => {
        event.preventDefault();
        setIsDisabled(true);
        setButtonText("Please wait...");
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/user/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                        password: password,
                    }),
                }
            );

            const result = await response.json();
            console.log(response);
            if (response.ok) {
                Swal.fire({
                    title: "Registration Success!",
                    icon: "success",
                    text: result.insert,
                    confirmButtonColor: "#B9875C"
                });
                setName("");
                setEmail("");
                setPassword("");
                setRePassword("");
                navigate("/login");
            } else {
                Swal.fire({
                    title: "Failed Registration",
                    icon: "error",
                    text: result.message,
                });
            }
          
        } catch (error) {
            console.error("Error during registration:", error);
            Swal.fire({
                title: "Failed Registration",
                icon: "error",
                text: "An unexpected error occurred. Please try again later.",
            });
        }
        setButtonText("REGISTER");
    };
    return (
        <>
            {user.id !== null ? (
                <Navigate to={"/"} />
            ) : (
                <>
                    <div style={{ overflow: "hidden" }} className="mt-5">
                        <Row className="">
                            <Col className="col-md-5 mx-auto">
                                <Form
                                    className="p-4 m-4 bg-white rounded-1"
                                    onSubmit={(event) => {
                                        registerUser(event);
                                    }}
                                >
                                    <h2 className="mb-3">Register</h2>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Name
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Name"
                                            required
                                            style={{
                                                boxShadow: "none",
                                            }}
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Email Address
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            required
                                            style={{
                                                boxShadow: "none",
                                            }}
                                            value={email}
                                            onChange={(event) =>
                                                setEmail(event.target.value)
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Password
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter password"
                                            required
                                            style={{
                                                boxShadow: "none",
                                            }}
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            Retype Password
                                            <span
                                                className="text-danger ms-2"
                                                style={{ fontSize: "0.8em" }}
                                            >
                                                (REQUIRED*)
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Retype password"
                                            required
                                            style={{
                                                boxShadow: "none",
                                            }}
                                            value={rePassword}
                                            onChange={(event) =>
                                                setRePassword(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={isDisabled}
                                            style={{backgroundColor: "#B9875C", border: "none"}}
                                        >
                                            {buttonText}
                                        </Button>
                                        <div className=" text-muted">
                                            Already Registered?
                                            <Link
                                                className="text-decoration-none"
                                                to={"/login"}
                                                style={{color: "#B9875C"}}
                                            >
                                                Login
                                            </Link>
                                        </div>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                </>
            )}
        </>
    );
}

export default Register;
