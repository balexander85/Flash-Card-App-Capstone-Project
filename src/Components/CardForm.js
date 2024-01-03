import {useHistory, useParams} from "react-router-dom";
import React from "react";

const CardForm = ({ handleSubmit, formData, setFormData }) => {
    const history = useHistory();
    const { deckId } = useParams();

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
                        <button type="reset" className="btn-secondary" onClick={() => history.push(`/decks/${deckId}`)}>Cancel</button>
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

export default CardForm;