import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaPencilAlt } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateNote, DeleteNoteById, GetAllNotes, UpdateNoteById } from './api';
import { notify } from './utils';

function NotesManager() {
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    const [notes, setNotes] = useState([]);
    const [updateNote, setUpdateNote] = useState(null);
    const [viewNote, setViewNote] = useState(null);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);

    const handleNote = async () => {
        if (!inputTitle) {
            notify('Title cannot be empty', 'error');
            return;
        }
        if (!inputDescription) {
            notify('Description cannot be empty', 'error');
            return;
        }

        const duplicateNote = notes.find(
            (note) => note.notesName === inputTitle && note._id !== (updateNote ? updateNote._id : null)
        );

        if (duplicateNote) {
            notify('A note with this title already exists', 'error');
            return;
        }

        if (updateNote) {
            const obj = {
                notesName: inputTitle,
                notesDescription: inputDescription,
                _id: updateNote._id
            };
            await handleUpdateNoteById(obj);
        } else {
            await handleAddNote();
        }
        setInputTitle('');
        setInputDescription('');
        setUpdateNote(null);
        setShowNotesModal(false);
    };

    useEffect(() => {
        if (updateNote) {
            setInputTitle(updateNote.notesName);
            setInputDescription(updateNote.notesDescription);
        } else {
            setInputTitle('');
            setInputDescription('');
        }
    }, [showNotesModal, updateNote]);

    const handleAddNote = async () => {
        const obj = {
            notesName: inputTitle,
            notesDescription: inputDescription
        };
        try {
            const { success, message } = await CreateNote(obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllNotes();
        } catch (err) {
            console.error(err);
            notify('Failed to create note', 'error');
        }
    };

    const fetchAllNotes = async () => {
        try {
            const { data } = await GetAllNotes();
            setNotes(data);
        } catch (err) {
            console.error(err);
            notify('Failed to fetch notes', 'error');
        }
    };

    useEffect(() => {
        fetchAllNotes();
    }, []);

    const handleDeleteNote = async (id) => {
        try {
            const { success, message } = await DeleteNoteById(id);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllNotes();
        } catch (err) {
            console.error(err);
            notify('Failed to delete note', 'error');
        }
    };

    const handleUpdateNoteById = async (item) => {
        const { _id, notesName, notesDescription } = item;
        const obj = {
            notesName,
            notesDescription
        };
        try {
            const { success, message } = await UpdateNoteById(_id, obj);
            if (success) {
                notify(message, 'success');
            } else {
                notify(message, 'error');
            }
            fetchAllNotes();
        } catch (err) {
            console.error(err);
            notify('Failed to update note', 'error');
        }
    };

    const formatDescription = (description) => {
        return description.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <div className='d-flex flex-column align-items-center w-75 m-auto mt-5'>
            <h1 className='mb-4'>Notes Manager</h1>
            <ToastContainer />
            <button
                type='button'
                className='btn btn-primary mb-3'
                onClick={() => {
                    setUpdateNote(null);
                    setShowNotesModal(true);
                }}
            >
                Add Note <FaPlus />
            </button>
            <div className='row w-100'>
                {notes.map((note) => (
                    <div key={note._id} className='col-md-4 mb-3'>
                        <div className='card text-bg-light'>
                            <div className='card-header'>{note.notesName}</div>
                            <div className='card-body'>
                                <p className='card-text'>
                                    {note.notesDescription.length > 30
                                        ? `${note.notesDescription.substring(0, 30)}...`
                                        : note.notesDescription}
                                    {note.notesDescription.length > 30 && (
                                        <button
                                            className='btn btn-link'
                                            onClick={() => {
                                                setViewNote(note);
                                                setShowViewModal(true);
                                            }}
                                        >
                                            more
                                        </button>
                                    )}
                                </p>
                            </div>
                            <div className='card-footer d-flex justify-content-between'>
                                <button
                                    className='btn btn-info btn-sm'
                                    onClick={() => {
                                        setUpdateNote(note);
                                        setShowNotesModal(true);
                                    }}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className='btn btn-danger btn-sm'
                                    onClick={() => handleDeleteNote(note._id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showNotesModal && (
                <div className='modal show d-block' tabIndex='-1'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    {updateNote ? 'Update Note' : 'Add Note'}
                                </h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => {
                                        setShowNotesModal(false);
                                        setUpdateNote(null);
                                    }}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                <div className='mb-3'>
                                    <label htmlFor='noteTitle' className='form-label'>
                                        <FaFileAlt /> Title
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='noteTitle'
                                        value={inputTitle}
                                        onChange={(e) => setInputTitle(e.target.value)}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='noteDescription' className='form-label'>
                                        <FaPencilAlt /> Description
                                    </label>
                                    <textarea
                                        className='form-control'
                                        id='noteDescription'
                                        rows='3'
                                        value={inputDescription}
                                        onChange={(e) => setInputDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => {
                                        setShowNotesModal(false);
                                        setUpdateNote(null);
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    onClick={handleNote}
                                >
                                    {updateNote ? 'Update Note' : 'Add Note'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && (
                <div className='modal show d-block' tabIndex='-1'>
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>
                                    {viewNote ? viewNote.notesName : ''}
                                </h5>
                                <button
                                    type='button'
                                    className='btn-close'
                                    onClick={() => setShowViewModal(false)}
                                ></button>
                            </div>
                            <div className='modal-body'>
                                <p className="break-word">{viewNote ? formatDescription(viewNote.notesDescription) : ''}</p>
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-secondary'
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotesManager;
