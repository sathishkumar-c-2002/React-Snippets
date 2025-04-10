import React, { useState } from 'react';

const LocalLookUp = () => {

    const localData = [
        { id: 1, name: 'Apple', category: 'Fruit' },
        { id: 2, name: 'Banana', category: 'Fruit' },
        { id: 3, name: 'Carrot', category: 'Vegetable' },
        { id: 4, name: 'Broccoli', category: 'Vegetable' },
        { id: 5, name: 'Chicken', category: 'Meat' },
        { id: 6, name: 'Beef', category: 'Meat' },
        { id: 7, name: 'Milk', category: 'Diary' },
    ];

    const [searchItem, setSearchItem] = useState('');
    const [selectedItem, setSelectedItem] = useState(null)
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const filterData = localData.filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()));


    const handleSelect = (item) => {
        setSelectedItem(item);
        setSearchItem(item.name);
        setIsDropDownOpen(false);

    }
    const handleInputChange = (event) => {
        setSearchItem(event.target.value);
        setIsDropDownOpen(true);

        if (!event.target.value) {
            setSelectedItem(null);
        }
    }
    return (
        <div>
            <h2>Local Lookup</h2>

            <input type='text' placeholder='Search Items' value={searchItem} onChange={handleInputChange} />


            {isDropDownOpen && filterData.length > 0 && (
                <ul>
                    {filterData.map((item) => (
                        <li key={item.id} onClick={handleSelect(item)}>
                            <div>{item.name}</div>
                            <div>{item.category}</div>
                        </li>
                    ))}
                </ul>
            )
            }
            {
                isDropDownOpen && filterData.length===0 &&(
                    <div>No items Found</div>
                )
            }
            {
                selectedItem && (
                    <div>
                        <h3>Selected Item</h3>
                        <h3>{selectedItem.name}</h3>
                        <h3>{selectedItem.category}</h3>
                        <h3>{selectedItem.id}</h3>
                    </div>
                )
            }
        </div>
    )
}

export default LocalLookUp;