import React, {Fragment, useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {createCard, readDeck} from "../utils/api";
import CardForm from "./CardForm";

/* AddCard component to add new card and reset form after submit */
const AddCard = () => {
    const [deck, setDeck] = useState({ cards: [] });
    const { deckId } = useParams();
    const initialFormData = {
        front: "",
        back: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();
        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.error);
        return () => abortController.abort();
    }, [deckId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        createCard(deckId, formData, abortController.signal)
            .then(() => {
                setDeck({...deck, cards: [...deck.cards, formData]});
                history.go(0)
                setFormData(initialFormData);
            })
            .catch(console.error);
        return () => abortController.abort();
    };

    return (
        <Fragment>
            <h2>Add Card</h2>
            <h2>{deck.name}</h2>
            <CardForm handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} />
        </Fragment>
    );
};

export default AddCard;