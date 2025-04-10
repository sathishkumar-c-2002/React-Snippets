import React, { useState } from 'react';

const DropDown = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const option = [
        { value: '', label: 'Select an Option' },
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        { value: 'option4', label: 'Option 4' }
    ];

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        console.log("Onchange Selected Option: ", selectedOption)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('SUbmit Selected Option: ', selectedOption);
    }


    return (
        <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label htmlFor='dropdown'>Choose an Option</label>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


                <select id='dropdown' value={selectedOption} onChange={handleChange} required>
                    {option.map((option) => {
                        return <option key={option.value} value={option.value}>{option.label}</option>
                    })}
                </select>
            </div>

            <button type="submit">Submit</button>
        </form>
    )
}
export default DropDown;