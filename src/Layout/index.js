import React, { Fragment, useEffect, useState } from "react";
import Header from "./Header";
import {
  listDecks,
  createDeck,
  deleteDeck,
  readDeck,
  createCard,
  readCard,
  updateDeck,
  updateCard,
  deleteCard
} from "../utils/api";
import { Link, Route, Switch, useHistory, useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { AddCardButton, CreateDeckButton, DeleteButton, EditButton, StudyButton, ViewButton } from "./Common";

const CardForm = ({ handleSubmit, handleChange, formData }) => {

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

const AddCard = () => {
  const [deck, setDeck] = useState({ cards: [] });
  const { deckId } = useParams();
  const initialFormData = {
    front: "",
    back: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

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
      <CardForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
    </Fragment>
  );
};

const EditCard = () => {
  const history = useHistory();
  const { deckId, cardId } = useParams();
  const [formData, setFormData] = useState({ front: "", back: "" });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

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
      <CardForm handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} />
    </Fragment>
  );
};

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

const CreateDeck = ({ handleNewDeck }) => {
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

const EditDeck = () => {
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
      .catch(console.log);
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

const DeckList = ({ decks, handleDeckDelete }) => {
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
        window.location.reload();
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
