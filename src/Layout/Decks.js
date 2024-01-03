import {Link, useHistory, useParams} from "react-router-dom";
import React, {Fragment, useEffect, useState} from "react";
import {deleteCard, readDeck, updateDeck} from "../utils/api";
import {AddCardButton, CreateDeckButton, DeleteButton, EditButton, StudyButton, ViewButton} from "./Common";

const DeckForm = ({ handleSubmit, handleChange, formData }) => {

    return (
        <form name="create" onSubmit={handleSubmit}>
            <table>
                <tbody>
                <tr>
                    <td><label htmlFor="name">Name</label></td>
                </tr>
                <tr>
                    <td>
                        <input name="name" placeholder="Deck name" value={formData.name} onChange={handleChange} required={true}/>
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="description">Description</label></td>
                </tr>
                <tr>
                    <td>
                        <textarea name="description" placeholder="Deck description" value={formData.description} onChange={handleChange}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Link to="/">
                            <button type="reset" className="btn-secondary">Cancel</button>
                        </Link>
                    </td>
                    <td>
                        <button type="submit" className="btn-primary">Submit</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
    );
};

export const CreateDeck = ({ handleNewDeck }) => {
    const initialFormData = {
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNewDeck(formData);
    };

    return (
        <Fragment>
            <h2>Create Deck</h2>
            <DeckForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
        </Fragment>
    );
};

export const EditDeck = () => {
    const history = useHistory();
    const { deckId } = useParams();
    const [formData, setFormData] = useState({ name: "", description: "" });

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

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
            <DeckForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
        </Fragment>
    );
};

export const Deck = ({ handleDeckDelete }) => {
    const [deck, setDeck] = useState({ cards: [] });
    const { deckId } = useParams();

    const handleCardDelete = (indexToDelete) => {
        const abortController = new AbortController();
        deleteCard(indexToDelete, abortController.signal)
            .then(() => {
                window.location.reload();
            })
            .catch(err => console.error(err));
        return () => abortController.abort();
    };

    useEffect(() => {
        const abortController = new AbortController();
        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.error);
        return () => abortController.abort();
    }, [deckId]);

    return (
        <section key={deckId}>
            <h3>{deck.name}</h3>
            <p>{deck.description}</p>
            <EditButton path={`/decks/${deckId}/edit`}/>
            <StudyButton deckId={deckId}/>
            <AddCardButton deckId={deckId} onClickHandler={() => console.log(`Adding cards to '${deckId}' deck`)}/>
            <DeleteButton onClickHandler={() => window.confirm("Delete this deck?") && handleDeckDelete(deck.id)}/>
            <h2>Cards</h2>
            {deck.cards.map((card) => {
                    return (
                        <section style={{ border: "1px solid black", padding: "10px" }} key={card.id}>
                            <div>{card.front}</div>
                            <div>{card.back}</div>
                            <EditButton path={`/decks/${deckId}/cards/${card.id}/edit`}/>
                            <DeleteButton onClickHandler={() => window.confirm("Delete this card?") && handleCardDelete(card.id)}/>
                        </section>
                    );
                }
            )}
        </section>
    );
};

export const DeckList = ({ decks, handleDeckDelete }) => {
    return (
        <Fragment>
            <CreateDeckButton/>
            {decks.map((deck) => (
                    <section style={{ border: "1px solid black", padding: "10px" }} key={deck.id}>
                        <h3 className="card-title">
                            {deck.name}
                        </h3>
                        <div>{deck.cards ? deck.cards.length : 0} cards</div>
                        <div className="card-description">
                            {deck.description}
                        </div>
                        <ViewButton deckId={deck.id}/>
                        <StudyButton deckId={deck.id}/>
                        <DeleteButton onClickHandler={() => window.confirm("Delete this deck?") && handleDeckDelete(deck.id)}/>
                    </section>
                )
            )}
        </Fragment>
    );
};
