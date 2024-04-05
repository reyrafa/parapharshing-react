import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function NotFoundPage() {
    return (
        <Container className="pt-5" style={{ height: "70vh" }}>
            <Row>
                <Col className="col-4 mx-auto">
                    <div className="text-center">
                        <FontAwesomeIcon
                            icon="fa-solid fa-circle-exclamation"
                            size="2xl"
                        />
                        <h1 className="mt-2">Page Not Found</h1>
                        <Link to={"/"}>Back to Home Page</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default NotFoundPage;
