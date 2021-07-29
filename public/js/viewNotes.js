let googleUserId;
let globalData;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    console.log("note changed!")
    const data = snapshot.val();
    renderDataAsHtml(data);
  });
};

const renderDataAsHtml = (data) => {
  let cards = ``;
  // noteItem is the id/key of the database (i.e. noteID)
  
//   var display = sortByTitle(data);
//   console.log(display)

  for (noteItem in data) {

    // console.log(data)
    const note = data[noteItem];
    // For each note create an HTML card
    cards += createCard(note, noteItem)

    // cards += createCard(display[i].note, display[i].noteItem)
  };


  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
  globalData =data;
};


const renderSortedData = () => {
    let cards = ``;


    data = globalData

  var display = sortByTitle(data);
  console.log(display)

  for (let i = 0; i < display.length; i++) {
    cards += createCard(display[i].note, display[i].noteItem)
  };


  // Inject our string of HTML into our viewNotes.html page
  document.querySelector('#app').innerHTML = cards;
}

const createCard = (note, noteId) => {
   return `
     <div class="column is-one-quarter">
       <div class="card">
         <header class="card-header">
           <p class="card-header-title">${note.title}</p>
         </header>
         <div class="card-content">
           <div class="content">${note.text}</div>
         </div>

         <footer class = "card-footer">
            <a 
                
                href = "#" 
                class = "card-footer-item" 
                onclick = "confirmDelete('${noteId}')"> 
                Delete
            </a>

            <a 
                 
                href = "#" 
                class = "card-footer-item" 
                onclick = "editNote('${noteId}')"> 
                Edit
            </a>
         </footer>
       </div>
     </div>
   `;
};

function deleteNote() {
    const noteId = document.querySelector('#noteId').value
    console.log(noteId)
    firebase.database().ref(`users/${googleUserId}/${noteId}`).remove()
    console.log('delete', noteId);
}

function confirmDelete(noteId) {
    console.log(noteId)
    document.querySelector("#noteId").value = noteId
    document.querySelector("#deleteNoteModal").classList.toggle("is-active")
}

function cancelDelete() {
    document.querySelector("#deleteNoteModal").classList.toggle("is-active")
}

function editNote(noteId) {
    const editNoteModal = document.querySelector("#editNoteModal")
    editNoteModal.classList.toggle("is-active")

    const notesRef = firebase.database().ref(`users/${googleUserId}/${noteId}`)
    notesRef.on('value', snapshot => {
        const note = snapshot.val()
        document.querySelector('#editTitleInput').value = note.title
        document.querySelector('#editTextInput').value = note.text
        document.querySelector("#noteId").value = noteId
    })
}

function saveEditedNote() {
    const title = document.querySelector('#editTitleInput').value 
    const text = document.querySelector('#editTextInput').value
    const noteId = document.querySelector('#noteId').value
    const editedNote = { title, text };
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(editedNote);
    closeEditModal()
}

function closeEditModal() {
    const editNoteModal = document.querySelector("#editNoteModal")
    editNoteModal.classList.toggle("is-active")
}

function sortByTitle(data) {
    console.log(data)
    var notes = []
    var answer = []
    // const note = data[title]
    // console.log(note)
    
    for (const noteItem in data) {
        // console.log(noteItem)
        const note = data[noteItem];
        notes.push({note, noteItem})

    }
    
    console.log(notes)

    for (let i = 0; i < notes.length - 1; i++) {
        var min = notes[i];
        var minIndex = i;
        for (let j = i + 1; j < notes.length; j++) {
            if (notes[j].note.title < min.note.title) {
                min = notes[j]
                minIndex = j
                console.log('swapped')
            }

            console.log(notes)
        }

        var temp = notes[minIndex]
        notes[minIndex] = notes[i]
        notes[i] = temp;
    }

    console.log(notes) 
    return notes
}

function sortByText() {

}
