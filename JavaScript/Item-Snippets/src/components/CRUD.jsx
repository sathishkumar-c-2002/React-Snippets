import React, { useState } from 'react'

function CrudOperation() {
    const [items, setItems] = useState([
        // { id: 1, name: 'Item1', description: "This is One" },
        // { id: 2, name: 'Item2', description: "This is Two" },
    ]);

    const [currentItem, setCurrentItem] = useState({ id: null, name: '', description: '' });
    const [editing, setEditing] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        if (editing == true) {
            setItems(items.map(item => (item.id == currentItem.id ? currentItem : item)));
        }
        else {
            setItems([...items, { ...currentItem, id: Date.now() }]);
        }
        setCurrentItem({ id: null, name: '', description: '' });
        setEditing(false)
    }

    const handleDelete = (id) => {
        setItems(items.filter(item => item.id !== id))
    }

    const handleEdit = (item) => {
        setCurrentItem(item);
        setEditing(true);
    }
    return (
        <div>
            <h3>Operations</h3>
            <div>
                <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Name' value={currentItem.name} onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })} />
                    <input type="text" placeholder='Description' value={currentItem.description} onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })} />
                    <button type='submit'>{editing?'Update':'Add'}</button>

                    {editing && <button onClick={()=>{
                        setCurrentItem({id:null,name:'',description:''});
                        setEditing(false)
                    }}>Cancel</button>}
                </form>
            </div>

            {/* List Items */}
            <div>
                <h2>Items</h2>
                {items.length==0?(
                    <p>No Items Found</p>
                ):(
                    <ul>
                        {items.map((item)=>(
                            <li key={item.id}>
                                {item.name}
                                {item.description}
                                <button onClick={()=>handleEdit(item)}>Edit</button>
                                <button onClick={()=>handleDelete(item.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default CrudOperation;