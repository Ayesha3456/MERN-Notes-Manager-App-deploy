const { createNotes, fetchAllNotes, updateNotesById, deleteNotesById } = require('../Controllers/NotesController');

const router = require('express').Router();

// To get all the Notess
router.get('/', fetchAllNotes);

// To create a Notes
router.post('/', createNotes);

// To update a Notes
router.put('/:id', updateNotesById);

// To delete a Notes
router.delete('/:id', deleteNotesById);

module.exports = router;