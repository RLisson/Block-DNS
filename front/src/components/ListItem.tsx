import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./ListItem.css"

function ListItem({ id, domain, deleteFunction, editFunction }: { id: number,domain: string, deleteFunction: (id: number) => void, editFunction: (id: number,newDomain: string) => void }) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedDomain, setEditedDomain] = useState<string>(domain);
    return (
        <li>
            <span className='list-item-name'>
                {isEditing ? 
                <input 
                type="text" 
                value={editedDomain} 
                onChange={(e) => setEditedDomain(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' ? 
                    () => {
                        setIsEditing(false);
                        editFunction(id,editedDomain);
                    } 
                    : null}/> 
                    : editedDomain}
                </span>
            <span className='action-btn'>
                <button onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon fontSize='small'/>
                </button>
                <button onClick={() => deleteFunction(id)}>
                    <DeleteIcon fontSize='small'/>
                </button>
            </span>
        </li>
    );
}
export default ListItem;