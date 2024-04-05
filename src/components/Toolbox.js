import { useContext, useEffect, useRef, useState } from "react";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";
import { ReactTyped } from "react-typed";
import { Link, Navigate, useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Toolbox() {
    const [sentence, setSentence] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const { user, setUser } = useContext(UserContext);
    const [words, setWords] = useState(0);
    const [characters, setCharacters] = useState(0);
    const [sents, setSents] = useState(0);
    const [parag, setParag] = useState(0);
    const [resultDisable, setResultDisable] = useState(true);

    const [highlightedSentence, setHighlightedSentence] = useState(null);
    const [divPosition, setDivPosition] = useState({});
    const [redoSentences, setRedoSentence] = useState([]);
    let [redoTimes, setRedoTimes] = useState(0);
    let [count, setCount] = useState(0);

    useEffect(() => {
        if (sentence !== "") {
            setDisable(false);

            const wordCount = sentence.trim().split(/\s+/).length;
            const charCount = sentence.length;

            const sentences = sentence
                .trim()
                .split(/[.!?]+/)
                .filter((sent) => sent.trim() !== "");
            const sentenceCount = sentences.length;

            const paragraphs = sentence
                .trim()
                .split("\n")
                .filter((paragraph) => paragraph.trim() !== "");
            const paragraphCount = paragraphs.length;

            setWords(wordCount);
            setCharacters(charCount);
            setSents(sentenceCount);
            setParag(paragraphCount);
        } else if (sentence === "") {
            setWords(0);
            setCharacters(0);
            setSents(0);
            setParag(0);
            setDisable(true);
            setLoading(false);
        }
    }, [sentence, result]);
    const rephraseSentence = async (event) => {
        setLoading(true);
        event.preventDefault();
        setRedoTimes(0);
        setRedoSentence([]);
        setCount(0);
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

        setResult(result.rephrased);
        setResultDisable(false);
        setLoading(false);
    };

    // Split text into sentences
    const sentences = result.split(/(?<=[.!?])/).map((sen) => sen.trim());

    // Function to handle word click
    const handleWordClick = (sentenceIndex, event) => {
        setHighlightedSentence(sentenceIndex);

        setDivPosition({
            top: event.clientY + "px",
            left: event.clientX + "px",
        });
    };

    // sentence paraphrase redo
    const redoParaphrase = async (toBeRephrase) => {
        const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/sentence/rephrase`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: toBeRephrase,
                }),
            }
        );
        const result = await response.json();
        const rephrased = result.rephrased;
        return rephrased;
    };

    const redoResult = async (highlightedSentence, event) => {
        event.preventDefault();
        setRedoTimes(++redoTimes);
        setCount(++count);
        const currentRedoSentence = {
            id: count,
            originSentenceId: highlightedSentence,
            sentence: sentences[highlightedSentence],
        };

        setRedoSentence((prevState) => [...prevState, currentRedoSentence]);
        const pharapRedo = await redoParaphrase(sentences[highlightedSentence]);
        sentences[highlightedSentence] = pharapRedo;

        const newSentence = sentences.join("");
        setResult(newSentence);
    };

    const undoResult = (highlightedSentence, event) => {
        event.preventDefault();
        setRedoTimes(--redoTimes);
        const sentencesWithSameRid = redoSentences.filter(
            (sentence) => sentence.originSentenceId === highlightedSentence
        );
        const sentenceWithMaxId = sentencesWithSameRid.reduce(
            (maxSentence, currentSentence) => {
                return currentSentence.id > maxSentence.id
                    ? currentSentence
                    : maxSentence;
            },
            { id: -1 }
        );
        const redoSent = sentenceWithMaxId.sentence;
        sentences[highlightedSentence] = redoSent;
        const newSentence = sentences.join("");
        setResult(newSentence);

        redoSentences.filter(
            (sentence) =>
                !(
                    sentence.originSentenceId === highlightedSentence &&
                    sentence.id === sentenceWithMaxId.id
                )
        );
    };

    const copyToClipboard = (event) => {
        event.preventDefault()
        navigator.clipboard
            .writeText(result)
            .then(() => {
                alert("Text copied to clipboard");
            })
            .catch((error) => {
                console.error("Failed to copy text: ", error);
                alert("Failed to copy text to clipboard");
            });
    };

    useEffect(() => {}, [redoSentences]);

    const backgroundColor = "#CBA574";
    const textColor = "#F6F6DF";
    return (
        <>
            {user.id === null ? (
                <Navigate to={"/login"} />
            ) : (
                <Container className="mt-5">
                    <Row
                        style={{ backgroundColor: backgroundColor }}
                        className="rounded"
                    >
                        <Col className="col-12 p-3">
                            <div
                                className="fs-5 fw-bold"
                                style={{ color: textColor }}
                            >
                                Paraphraser
                            </div>
                        </Col>
                        <div className=" border-bottom"></div>

                        <Form
                            onSubmit={(event) => {
                                rephraseSentence(event);
                            }}
                            style={{ padding: "0" }}
                        >
                            <Col className="col-12 p-3">
                                <div
                                    className="fw-bold d-flex align-items-center"
                                    style={{
                                        color: textColor,
                                        fontSize: "18px",
                                    }}
                                >
                                    Modes :
                                    <Form.Select
                                        aria-label="Default select example"
                                        className="w-50 ms-2"
                                        style={{
                                            backgroundColor: backgroundColor,
                                            color: textColor,
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                    >
                                        <option value="1">Standard</option>
                                        <option value="2">Casual</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col className="col-12 col-md-6 p-3">
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Control
                                        as="textarea"
                                        rows={10}
                                        value={sentence}
                                        onChange={(event) => {
                                            setSentence(event.target.value);
                                        }}
                                        style={{
                                            background: backgroundColor,
                                            border: "none",
                                            boxShadow: "none",
                                        }}
                                        placeholder="To rewrite text, please Enter or Paste here and press paraphrase.."
                                    />
                                </Form.Group>
                            </Col>
                            <div className=" border-bottom"></div>
                            <Col className="col-12 col-md-6 p-3">
                                <div>
                                    {sentences.map((sentence, index) => (
                                        <p
                                            key={index}
                                            style={{
                                                backgroundColor:
                                                    highlightedSentence ===
                                                    index
                                                        ? "yellow"
                                                        : "transparent",
                                            }}
                                            onClick={(event) =>
                                                handleWordClick(index, event)
                                            }
                                        >
                                            {sentence}
                                        </p>
                                    ))}
                                    {highlightedSentence !== null && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: divPosition.top,
                                                left: divPosition.left,
                                                border: "1px solid black",
                                                padding: "5px",
                                                backgroundColor: "white",
                                            }}
                                            className="rounded"
                                        >
                                            <Button
                                                onClick={(event) => {
                                                    redoResult(
                                                        highlightedSentence,
                                                        event
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
                                            </Button>
                                            {redoTimes !== 0 ? (
                                                <Button
                                                    className="ms-3"
                                                    onClick={(event) => {
                                                        undoResult(
                                                            highlightedSentence,
                                                            event
                                                        );
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon="fa-solid fa-arrow-rotate-left" />
                                                </Button>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <div className="text-center mt-5">
                                <Button
                                    className="mb-5"
                                    style={{
                                        backgroundColor: "#EACDA6",
                                        border: "none",
                                        boxShadow: "none",
                                    }}
                                    type="submit"
                                    disabled={disable}
                                >
                                    {loading ? "loading..." : "PARAPHRASE"}
                                </Button>
                            </div>
                        </Form>
                        <Col>
                            <Button
                                onClick={(event) => {
                                    copyToClipboard(event);
                                }}
                                style={{
                                    backgroundColor: backgroundColor,
                                    border: "none",
                                    color: textColor,
                                }}
                                className="fs-1"
                            >
                                <FontAwesomeIcon
                                    icon="fa-solid fa-clipboard"
                                    size="lg"
                                />
                            </Button>
                        </Col>
                    </Row>
                    <Row className="col-12 col-md-6 mt-5 pt-5 mx-auto">
                        <Col>
                            <Table hover striped size="sm" className="border">
                                <thead>
                                    <tr>
                                        <th
                                            className="text-center"
                                            style={{
                                                color: textColor,
                                                backgroundColor:
                                                    backgroundColor,
                                            }}
                                            colSpan={2}
                                        >
                                            Details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Words</td>
                                        <td>{words}</td>
                                    </tr>
                                    <tr>
                                        <td>Characters</td>
                                        <td>{characters}</td>
                                    </tr>
                                    <tr>
                                        <td>Sentences</td>
                                        <td>{sents}</td>
                                    </tr>
                                    <tr>
                                        <td>Paragraph</td>
                                        <td>{parag}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
}

export default Toolbox;
