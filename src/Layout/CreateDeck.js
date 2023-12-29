import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";

export const CreateDeckForm = ({handleNewDeck}) => {
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