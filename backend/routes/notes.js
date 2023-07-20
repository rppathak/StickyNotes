const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All Notes using: GET "/api/auth/getuser". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
})

// ROUTE 2: Add a New Notes using: GET "/api/auth/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, description, tag } = req.body; //destructuring
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 3: Update an Existing Notes using: GET "/api/auth/addnote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) =>{
    const { title, description, tag } = req.body;
    try {
        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Some Validations so that only the user can change notes
        //check if notes exist
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        //Someone else is trying to access notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Find the note to be updated and update it
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }) //{ new: true } if new note then it will be created
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an Existing Notes using: DELETE "/api/auth/addnote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) =>{
    const { title, description, tag } = req.body;
    try {

        //Some Validations so that only the user can delete notes
        //check if notes exist
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        //Someone else is trying to delete notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Find the note to be deleted and delete it
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json("deleted sucessfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router