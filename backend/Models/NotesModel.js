const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotesSchema = new Schema({
    notesName: {
        type: String,
        required: true
    },
    notesDescription: {
        type: String,
        required: true
    }
});

const NotesModel = mongoose.model('notes', NotesSchema);
module.exports = NotesModel;