import {Link} from "react-router-dom";
import React from "react";

const DeckForm = ({ handleSubmit, setFormData, formData }) => {

    const handleChange = ({ target }) => {
        setFormData({ ...formData, [target.name]: target.value });
    };

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

export default DeckForm;