import { Link, useHistory, useParams } from "react-router-dom";
import React, { Fragment, useEffect, useState } from "react";
import { createCard, readCard, readDeck, updateCard } from "../utils/api";

const CardForm = ({ handleSubmit, formData, setFormData }) => {

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    return (
        <form onSubmit={handleSubmit}>
            <table>
                <tbody>
                <tr>
                    <td><label htmlFor="front">Front</label></td>
                </tr>
                <tr>
                    <td>
              <textarea name="front" placeholder="Front side of card" value={formData.front}
                        onChange={handleChange} required={true}/>
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="back">Back</label></td>
                </tr>
                <tr>
                    <td>
              <textarea name="back" placeholder="Back side of card" value={formData.back}
                        onChange={handleChange} required={true}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Link to="/">
                            <button type="reset" className="btn-secondary">Cancel</button>
                        </Link>
                    </td>
                    <td>
                        <button type="submit" className="btn-primary">Save</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
};

export const AddCard = () => {
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
            .catch(console.log);
        return () => abortController.abort();
    }, [deckId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        createCard(deckId, formData, abortController.signal)
            .then(() => history.push(`/decks/${deckId}`))
            .catch(err => console.error(err));
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

export const EditCard = () => {
    const history = useHistory();
    const { deckId, cardId } = useParams();
    const [formData, setFormData] = useState({ front: "", back: "" });

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        updateCard(formData, abortController.signal)
            .then((response) => {
                console.log(response);
                history.push(`/decks/${deckId}`);
            })
            .catch(console.error);
        return () => abortController.abort();
    };

    useEffect(() => {
        const abortController = new AbortController();
        readCard(cardId, abortController.signal)
            .then(setFormData)
            .catch(console.log);
        return () => abortController.abort();
    }, [cardId]);

    return (
        <Fragment>
            <h2>Edit Card</h2>
            <CardForm handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} />
        </Fragment>
    );
};
