import React, { Fragment, useEffect, useState } from "react";
import Header from "./Header";
import {
  listDecks,
  createDeck,
  deleteDeck,
} from "../utils/api";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "../Components/Home";
import CreateDeck from "../Components/CreateDeck";
import EditDeck from "../Components/EditDeck";
import Deck from "../Components/Deck";
import AddCard from "../Components/AddCard";
import EditCard from "../Components/EditCard";
import StudyScreen from "../Components/Study";


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
            <Home decks={decks} handleDeckDelete={handleDeckDelete} />
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
