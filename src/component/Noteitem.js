import React, { useContext } from 'react'
import noteContext from '../context/notes/NoteContext'

const Noteitem = (props) => {
    const context = useContext(noteContext)
    const { deleteNote } = context;
    const { note, updateNote } = props
    return (
        <div className='col-md-3'>
            <div className="card my-3 shadow-sm p-3 mb-5 rounded" style={{ backgroundColor: 'yellow' }}>
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h5 className="card-title">{note.title}</h5>
                        <div>
                            <i className="fa-solid fa-trash mx-2" onClick={() => (deleteNote(note._id), props.showAlert("deleted sucessfully", "success", { marginTop: '50px' }))} />
                            <i className="fa-solid fa-pen-to-square mx-2" onClick={() => { updateNote(note) }} />
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Noteitem