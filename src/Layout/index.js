import React, {Fragment, useEffect, useState} from "react";
import Header from "./Header";
import {listDecks, createDeck, deleteDeck, readDeck} from "../utils/api";
import {Link, Route, Switch, useHistory, useParams, useRouteMatch} from "react-router-dom";
import NotFound from "./NotFound";

const CreateDeckForm = ({handleNewDeck}) => {
    const initialFormData = {
        name: '',
        description: '',
    }
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = ({target}) => {
        setFormData({...formData, [target.name]: target.value});
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNewDeck(formData);
    }

    return (
        <Fragment>
            <h2>Create Deck</h2>
            <form name="create" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                    <tr>
                        <td><label htmlFor="name">Name</label></td>
                    </tr>
                    <tr>
                        <td>
                            <input name="name" placeholder="Deck Name" value={formData.name} onChange={handleChange}
                                   required={true}/>
                        </td>
                    </tr>
                    <tr>
                        <td><label htmlFor="description">Description</label></td>
                    </tr>
                    <tr>
                        <td>
                            <textarea name="description" placeholder="Brief description of the deck"
                                      value={formData.description} onChange={handleChange}/>
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
        </Fragment>
    );
}

const StudyScreen = () => {
    const [deck, setDeck] = useState({cards: []});
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const {deckId} = useParams();

    useEffect(() => {
        const abortController = new AbortController();
        readDeck(deckId, abortController.signal)
            .then(setDeck)
            .catch(console.log);
    }, [deckId]);

    if (deck.cards.length < 3) {
        return (
            <p>Not enough cards. The minimum is 3 cards to study.</p>
        )
    } else {
        return (
            <div>
                <h2>Study: {deck.name}</h2>
                <div style={{border: '1px solid black', padding: '10px'}}>
                    <h4>Card {cardIndex + 1} of {deck.cards.length}</h4>
                    <Fragment>
                        {isFlipped ? <div>{deck.cards[cardIndex].back}</div> : <div>{deck.cards[cardIndex].front}</div>}
                        <button className="btn-lg" onClick={() => setIsFlipped(!isFlipped)}>Flip</button>
                        {isFlipped && <button className="btn-lg btn-primary" onClick={() => {
                            setCardIndex(cardIndex => cardIndex + 1);
                            setIsFlipped(false);
                        }}>Next</button>}
                    </Fragment>
                </div>
                {(isFlipped && cardIndex+1 === deck.cards.length) && window.confirm('Restart deck?') ? setCardIndex(0) : null}
            </div>
        )
    }
}
const DeckCard = ({deck, handleDelete}) => {
    const deckCardCount = deck.cards?.length;

    return (
        <section style={{border: '1px solid black', padding: '10px'}} key={deck.id}>
            <h3 className="card-title">
                {deck.name}
            </h3>
            <div>{deckCardCount} cards</div>
            <div className="card-description">
                {deck.description}
            </div>
            <Link to={`/decks/${deck.id}/show`}>
                <button className="btn btn-secondary" onClick={() => console.log(`Viewing '${deck.name}' deck`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye"
                         viewBox="0 0 16 16">
                        <path
                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                    </svg>
                    View
                </button>
            </Link>
            <Link to={`decks/${deck.id}/study`}>
                <button className="btn btn-primary" onClick={() => console.log(`Studying '${deck.name}' deck`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-book" viewBox="0 0 16 16">
                        <path
                            d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
                    </svg>
                    Study
                </button>
            </Link>
            <button className="btn btn-danger" onClick={() => window.confirm('Delete this deck?') && handleDelete(deck.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     className="bi bi-trash" viewBox="0 0 16 16">
                    <path
                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </button>
        </section>
    )
}
const DeckCardList = ({decks, handleDelete}) => {
    return decks.map((deck) => <DeckCard key={deck.id} deck={deck} handleDelete={handleDelete}/>)
}
const CreateDeckButton = () => {
    return (
        <Link to={'/decks/new'}>
            <button className="btn btn-secondary btn-lg">+ Create Deck</button>
        </Link>
    )
};

function Layout() {
    const [decks, setDecks] = useState([]);
    const history = useHistory();

    const handleNewDeck = (newDeck) => {
        const abortController = new AbortController();
        createDeck(newDeck, abortController.signal)
            .then(() => {
                console.log('newDeck', newDeck);
                setDecks(currentDecks => [...currentDecks, {...newDeck, id: decks.length + 1}]);
                history.push('/');
            })
            .catch(err => console.error(err));
    }
    const handleDelete = (indexToDelete) => {
        const abortController = new AbortController();
        deleteDeck(indexToDelete, abortController.signal)
            .then(() => {
                setDecks(currentDecks => currentDecks.filter(deck => deck.id !== indexToDelete))
                history.push('/');
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {
        setDecks([]);
        const abortController = new AbortController();
        listDecks(abortController.signal)
            .then(setDecks)
            .catch(console.error);
        return () => abortController.abort();
    }, [])

    return (
        <Fragment>
            <Header/>
            <div className="container">
                <Switch>
                    <Route exact path="/">
                        <CreateDeckButton/>
                        <DeckCardList decks={decks} handleDelete={handleDelete}/>
                    </Route>
                    <Route path="/decks/new">
                        <CreateDeckForm handleNewDeck={handleNewDeck}/>
                    </Route>
                    <Route path={"/decks/:deckId/study"}>
                        <StudyScreen/>
                    </Route>
                    <Route>
                        <NotFound/>
                    </Route>
                </Switch>
            </div>
        </Fragment>
    );
}

export default Layout;