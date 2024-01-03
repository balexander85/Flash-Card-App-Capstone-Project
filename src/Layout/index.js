import React, { Fragment, useEffect, useState } from "react";
import Header from "./Header";
import {
  listDecks,
  createDeck,
  deleteDeck,
  readDeck,
} from "../utils/api";
import { Link, Route, Switch, useHistory, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { AddCardButton } from "./Common";
import { CreateDeck, DeckList, Deck, EditDeck } from "./Decks";
import { AddCard, EditCard } from "./Cards";

const StudyScreen = () => {
  const history = useHistory();
  const [deck, setDeck] = useState({ cards: [] });
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { deckId } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal)
      .then(setDeck)
      .catch(console.error);
    return () => abortController.abort();
  }, [deckId]);

  const handleNextButtonClick = () => {
    if (cardIndex + 1 === deck.cards.length) {
      const shouldRestart = window.confirm("Restart deck?");
      if (shouldRestart) {
        setCardIndex(0);
        setIsFlipped(false);
      } else {
        history.push("/");
      }
    } else {
      setCardIndex(cardIndex + 1);
      setIsFlipped(false);
    }
  };

  return (
    <section>
      <h2>Study</h2>
      <h2>{deck.name}</h2>
      {deck.cards.length < 3 ? (
        <Fragment>
          <h2>Not enough cards.</h2>
          <p>
                The minimum is 3 cards to study. There are {deck.cards.length} cards
                in this deck
          </p>
          <AddCardButton deckId={deckId} />
        </Fragment>
      ) : (
        <Fragment>
          <div style={{ border: "1px solid black", padding: "10px" }}>
            <h4>
                  Card {cardIndex + 1} of {deck.cards.length}
            </h4>
            <Fragment>
              {isFlipped ? (
                <div>{deck.cards[cardIndex].back}</div>
              ) : (
                <div>{deck.cards[cardIndex].front}</div>
              )}
              <button
                className="btn-lg"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                    Flip
              </button>
              {isFlipped && (
                <button
                  className="btn-lg btn-primary"
                  onClick={handleNextButtonClick}
                >
                        Next
                </button>
              )}
            </Fragment>
          </div>
        </Fragment>
      )}
    </section>
  );
};

const NavBar = () => {
  // const history = useHistory();

  return (
      <Fragment>
        <Link to="/"><button>Home</button></Link>
        <br/>
      </Fragment>
  );
};

const Layout = () => {
  const [decks, setDecks] = useState([]);
  const history = useHistory();

  const handleNewDeck = (newDeck) => {
    const abortController = new AbortController();
    createDeck(newDeck, abortController.signal)
      .then(() => {
        console.log("newDeck", newDeck);
        setDecks(currentDecks => [...currentDecks, { ...newDeck, id: decks.length + 1 }]);
        history.push("/");
      })
      .catch(err => console.error(err));
    return () => abortController.abort();
  };

  const handleDeckDelete = (indexToDelete) => {
    const abortController = new AbortController();
    deleteDeck(indexToDelete, abortController.signal)
      .then(() => {
        setDecks(currentDecks => currentDecks.filter(deck => deck.id !== indexToDelete));
        history.push("/");
      })
      .catch(err => console.error(err));
    return () => abortController.abort();
  };

  useEffect(() => {
    setDecks([]);
    const abortController = new AbortController();
    listDecks(abortController.signal)
      .then(setDecks)
      .catch(console.error);
    return () => abortController.abort();
  }, []);

  return (
    <Fragment>
      <Header/>
      <div className="container">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <DeckList decks={decks} handleDeckDelete={handleDeckDelete} />
          </Route>
          <Route path="/decks/new">
            <CreateDeck handleNewDeck={handleNewDeck}/>
          </Route>
          <Route exact path={"/decks/:deckId"}>
            <Deck handleDeckDelete={handleDeckDelete} />
          </Route>
          <Route exact path={"/decks/:deckId/edit"}>
            <EditDeck/>
          </Route>
          <Route path={"/decks/:deckId/cards/new"}>
            <AddCard/>
          </Route>
          <Route path={"/decks/:deckId/cards/:cardId/edit"}>
            <EditCard/>
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
};

export default Layout;
