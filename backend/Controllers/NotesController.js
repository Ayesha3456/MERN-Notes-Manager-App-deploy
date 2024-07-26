const NotesModel = require("../Models/NotesModel");


const createNotes = async (req, res) => {
    const data = req.body;
    try {
        const model = new NotesModel(data);
        await model.save();
        res.status(201)
            .json({ message: 'Notes is created', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create Notes', success: false });
    }
}

const fetchAllNotes = async (req, res) => {
    try {
        const data = await NotesModel.find({});
        res.status(200)
            .json({ message: 'All Notess', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get all Notess', success: false });
    }
}


const updateNotesById = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const obj = { $set: { ...body } };
        await NotesModel.findByIdAndUpdate(id, obj)
        res.status(200)
            .json({ message: 'Notes Updated', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to updated Notes', success: false });
    }
}


const deleteNotesById = async (req, res) => {
    try {
        const id = req.params.id;
        await NotesModel.findByIdAndDelete(id);
        res.status(200)
            .json({ message: 'Notes is deleted', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete Notes', success: false });
    }
}

module.exports = {
    createNotes,
    fetchAllNotes,
    updateNotesById,
    deleteNotesById
}