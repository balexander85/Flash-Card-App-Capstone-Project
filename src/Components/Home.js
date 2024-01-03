import React, {Fragment} from "react";
import {CreateDeckButton, DeleteButton, StudyButton, ViewButton} from "../Layout/Common";

const Home = ({ decks, handleDeckDelete }) => {

    if (decks.length > 0) {
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
    }
    return <div>Loading...</div>;
};

export default Home;