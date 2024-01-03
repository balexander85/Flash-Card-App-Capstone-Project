import React, {Fragment, useState} from "react";
import DeckForm from "./DeckForm";

const CreateDeck = ({ handleNewDeck }) => {
    const initialFormData = {
        name: "",
        description: "",
    };
    const [formData, setFormData] = useState(initialFormData)
    const handleSubmit = (event) => {
        event.preventDefault();
        handleNewDeck(formData);
    };

    return (
        <Fragment>
            <h2>Create Deck</h2>
            <DeckForm handleSubmit={handleSubmit} setFormData={setFormData} formData={formData} />
        </Fragment>
    );
};

export default CreateDeck;