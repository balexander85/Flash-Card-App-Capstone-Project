import {useHistory, useParams} from "react-router-dom";
import React, {Fragment, useEffect, useState} from "react";
import {readDeck, updateDeck} from "../utils/api";
import DeckForm from "./DeckForm";

const EditDeck = () => {
    const history = useHistory();
    const { deckId } = useParams();
    const [formData, setFormData] = useState({ name: "", description: "" });

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        updateDeck({ id: deckId, ...formData }, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push(`/decks/${deckId}`);
            })
            .catch(console.error);
        return () => abortController.abort();
    };

    useEffect(() => {
        const abortController = new AbortController();
        readDeck(deckId, abortController.signal)
            .then(setFormData)
            .catch(console.error);
        return () => abortController.abort();
    }, [deckId]);

    return (
        <Fragment>
            <h2>Edit Deck</h2>
            <DeckForm handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} />
        </Fragment>
    );
};

export default EditDeck;