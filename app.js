
const noteTextarea = document.getElementById('new-note-text');
const addNoteBtn = document.getElementById('add-note-btn');
const notesList = document.getElementById('notes-list');
const noteTemplate = document.getElementById('note-template');
const offlineStatus = document.getElementById('offline-status');

// массив с заметками
let notes = [];

// чек интернет соединения
function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineStatus.classList.add('hidden');
    } else {
        offlineStatus.classList.remove('hidden');
    }
}

// слушатели событий изменения статуса соединения
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function init() {
    updateOnlineStatus();
    loadNotes();
    renderNotes();
    
    addNoteBtn.addEventListener('click', addNote);
}

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function addNote() {
    const noteText = noteTextarea.value.trim();
    if (noteText) {
        const newNote = {
            id: Date.now(),
            text: noteText,
            createdAt: new Date().toISOString()
        };
        
        notes.unshift(newNote); 
        saveNotes();
        renderNotes();
        noteTextarea.value = '';
    }
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

function editNote(noteId) {
    const note = notes.find(note => note.id === noteId);
    if (note) {
        const newText = prompt('Редактировать заметку:', note.text);
        if (newText !== null && newText.trim() !== '') {
            note.text = newText.trim();
            saveNotes();
            renderNotes();
        }
    }
}

function renderNotes() {
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'У вас пока нет заметок';
        emptyMessage.className = 'empty-notes-message';
        notesList.appendChild(emptyMessage);
        return;
    }
    
    notes.forEach(note => {
        const noteElement = document.importNode(noteTemplate.content, true);
        const noteContent = noteElement.querySelector('.note-content');
        noteContent.textContent = note.text;
        
        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
        
        const editBtn = noteElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editNote(note.id));
        
        notesList.appendChild(noteElement);
    });
}

document.addEventListener('DOMContentLoaded', init); 