import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ReactTyped } from "react-typed";
function Toolbox() {
    const [sentence, setSentence] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (sentence !== "") {
            setDisable(false);
         
        } else if (sentence === "") {
            setDisable(true);
            setLoading(false);
        }
    }, [sentence, response]);
    const rephraseSentence = async (event) => {
        setLoading(true)
        event.preventDefault();
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/sentence/rephrase`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: sentence,
                }),
            }
        );
        const result = await response.json();
        // console.log("hello")
        // console.log(result);

        setResponse(result.rephrased);
        setLoading(false);
    };
    return (
        <>
            <Form
                onSubmit={(event) => {
                    rephraseSentence(event);
                }}
            >
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={sentence}
                        onChange={(event) => {
                            setSentence(event.target.value);
                        }}
                        placeholder="Please paste your text here and press paraphrase.."
                    />
                </Form.Group>
                <Button className="mt-4" type="submit" disabled={disable}>
                    {loading ? "loading..." : "PARAPHRASE"}
                </Button>
            </Form>
            <h3 className="mt-4">RESULT:</h3>
            <ReactTyped strings={[response]} typeSpeed={40}></ReactTyped>
            {/* <div>{response}</div> */}
        </>
    );
}

export default Toolbox;
