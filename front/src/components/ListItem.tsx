import { useState } from 'react';
import "./ListItem.css"

function ListItem({ 
    id, 
    domain, 
    deleteFunction, 
    editFunction, 
    externalLoading 
}: { 
    id: number,
    domain: string, 
    deleteFunction: (id: number) => void, 
    editFunction: (id: number,newDomain: string) => void,
    externalLoading?: 'deleting' | 'updating' | null 
}) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedDomain, setEditedDomain] = useState<string>(domain);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isDeleting = externalLoading === 'deleting';
    const isUpdating = externalLoading === 'updating' || isLoading;

    const handleSave = async () => {
        if (editedDomain.trim() === '') {
            setEditedDomain(domain);
            setIsEditing(false);
            return;
        }

        setIsLoading(true);
        try {
            await editFunction(id, editedDomain);
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setEditedDomain(domain); // Reset to original value on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteFunction(id);
        } catch (error) {
            console.error('Erro ao deletar:', error);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedDomain(domain); // Reset to original value
        }
    };

    return (
        <li className={`${isUpdating || isDeleting ? 'loading-item' : ''} ${isDeleting ? 'deleting' : ''}`}>
            <div className='domain-info'>
                {isEditing ? (
                    <input 
                        type="text" 
                        value={editedDomain} 
                        onChange={(e) => setEditedDomain(e.target.value)} 
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="domain-edit-input"
                        placeholder="Digite o domínio..."
                        disabled={isUpdating || isDeleting}
                    />
                ) : (
                    <>
                        <span className='domain-url'>{editedDomain}</span>
                        <span className='domain-id'>ID: {id}</span>
                        {isDeleting && <span className='loading-text'>Deletando...</span>}
                        {isUpdating && !isDeleting && <span className='loading-text'>Atualizando...</span>}
                    </>
                )}
            </div>
            <div className='action-btn'>
                <button 
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`edit-btn ${isEditing ? 'saving' : ''} ${isUpdating ? 'loading' : ''}`}
                    title={isEditing ? (isUpdating ? "Salvando..." : "Salvar") : "Editar"}
                    disabled={isUpdating || isDeleting}
                >
                </button>
                <button 
                    onClick={handleDelete}
                    className={`delete-btn ${isDeleting ? 'deleting' : ''}`}
                    title={isDeleting ? "Deletando..." : "Deletar"}
                    disabled={isUpdating || isDeleting}
                >
                </button>
            </div>
        </li>
    );
}
export default ListItem;