const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
      //alert('Please Log In');
      window.location.href="signIn.html" ;
  }
});
// Create element and render users
var table= $('#UsersTable').DataTable( );


const renderUser = doc => {
  

  table.row.add($(
    "<tr  data-id="+doc.id+">"+
      "<td>"+doc.data().user_id+"</td>"+
      "<td>"+doc.data().user_name+"</td>"+
      "<td>"+doc.data().phone_number+"</td>"+
      "<td>"+doc.data().user_type+"</td>"+
      "<td>"+
        "<button class='btn btn-edit'>Edit</button>"+
        "<button class='btn btn-delete'>Delete</button>"+
      "</td>"+
    "</tr>"
  )).draw(false);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  if(btnEdit!=null){
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');
    //alert("i am called");
    id = doc.id;
    editModalForm.user_name.value = doc.data().user_name;
    editModalForm.phone_number.value = doc.data().phone_number;
    editModalForm.user_type.value = doc.data().user_type;

  });
}

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  if(btnDelete!=null){
    btnDelete.addEventListener('click', () => {
      db.collection('Users').doc(doc.id).delete().then(() => {
        console.log('Document succesfully deleted!');
      }).catch(err => {
        console.log('Error removing document', err);
      });
    });
  
  }
  
}

// Click add user button

btnAdd.addEventListener('click', () => {
  
  addModal.classList.add('modal-show');
  addModalForm.user_name.value = '';
  addModalForm.phone_number.value = '';
  addModalForm.user_type.value = '';
  addModalForm.user_id.value='';
});

// User click anyware outside the modal
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

// Get all users
 db.collection('users').get().then(querySnapshot => {
   querySnapshot.forEach(doc => {
    //renderUser(doc);
    console.log(doc.data());
   })
 });

 

// Real time listener
db.collection('Users').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      table.row(tr).remove();
      table.rows().draw();
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      table.row(tr).remove();
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal

addModalForm.addEventListener('submit', e => {
  e.preventDefault();
 
  var docRef=db.collection('Users').doc();
  var doc_id=docRef.id;
  docRef.set({
    user_name: addModalForm.user_name.value,
    phone_number: addModalForm.phone_number.value,
    user_type: addModalForm.user_type.value,
    user_id:doc_id,
  });

  
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('Users').doc(id).update({
    user_name: editModalForm.user_name.value,
    phone_number: editModalForm.phone_number.value,
    user_type: editModalForm.user_type.value,
    
  });
  editModal.classList.remove('modal-show');
  
});


