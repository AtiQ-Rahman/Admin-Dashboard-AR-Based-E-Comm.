const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableAllProducts = document.querySelector('.table-AllProducts');

let id;

// Create element and render AllProducts
var table= $('#ProductsTable').DataTable( );


const renderUser = doc => {
  
  var imagepath= '../img/ar.png';

  if(doc.data().compress_image_path !== null && doc.data().compress_image_path !== ''){
    imagepath = doc.data().compress_image_path;
  }
  table.row.add($(
    "<tr  data-id="+doc.id+">"+
    "<td > " + "<img width='50' height='50' src=" +imagepath+">"+"</td>"+
      "<td >"+doc.data().alternative_id+"</td>"+
      "<td>"+doc.data().name+"</td>"+
      "<td>"+doc.data().type+"</td>"+
      "<td>"+doc.data().color+"</td>"+
      "<td>"+doc.data().price+"</td>"+
      "<td>"+
        "<button class='btn btn-edit'>Edit</button>"+
        "<button class='btn btn-delete'>Delete</button>"+
      "</td>"+
    "</tr>"
  )).draw(true);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  if(btnEdit!=null){
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');
    //alert("i am called");
    id = doc.id;
    editModalForm.name.value = doc.data().name;
    editModalForm.type.value = doc.data().type;
    editModalForm.color.value = doc.data().color;
    editModalForm.price.value = doc.data().price;

  });
}

  // Click delete user
  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  if(btnDelete!=null){
    btnDelete.addEventListener('click', () => {
      db.collection('AllProducts').doc(doc.id).delete().then(() => {
        console.log('Document succesfully deleted!');
      }).catch(err => {
        console.log('Error removing document', err);
      });
    });
  
  }
  
}

// Click add user button

// btnAdd.addEventListener('click', () => {
  
//   addModal.classList.add('modal-show');
//   addModalForm.name.value = '';
//   addModalForm.color.value = '';
//   addModalForm.type.value = '';
//   addModalForm.price.value = '';
//   addModalForm.product_id.value='';
// });

// User click anyware outside the modal
window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

// Get all AllProducts
 db.collection('AllProducts').get().then(querySnapshot => {
   querySnapshot.forEach(doc => {
    //renderUser(doc);
    console.log(doc.data());
   })
 });

 

// Real time listener
db.collection('AllProducts').onSnapshot(snapshot => {
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

// addModalForm.addEventListener('submit', e => {
//   e.preventDefault();
 
//   var docRef=db.collection('AllProducts').doc();
//   var doc_id=docRef.id;
//   docRef.set({
//     name: addModalForm.name.value,
//     color: addModalForm.color.value,
//     type: addModalForm.type.value,
//     price: addModalForm.price.value,
//     user_id:doc_id,
//   });

  
//   modalWrapper.classList.remove('modal-show');
// });

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('AllProducts').doc(id).update({
    name: editModalForm.name.value,
    color: editModalForm.color.value,
    type: editModalForm.type.value,
    price: editModalForm.price.value,
    
  });
  editModal.classList.remove('modal-show');
  
});


