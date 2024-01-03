import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {deleteCard, readDeck} from "../utils/api";
import {AddCardButton, DeleteButton, EditButton, StudyButton} from "../Layout/Common";

const Deck = ({ handleDeckDelete }) => {
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

export default Deck;