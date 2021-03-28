const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');


// Create element and render Orders
var table = $('#OrdersTable').DataTable();
let id;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
        //alert('Please Log In');
        window.location.href="signIn.html" ;
    }
  });
const renderUser = doc => {

    var imagepath = '../img/ar.png';
    var date = doc.data().order_time.toDate().toUTCString();

    if (doc.data().img_path !== null && doc.data().img_path !== '') {
        imagepath = doc.data().img_path;
    }
    table.row.add($(
        "<tr  data-id=" + doc.id + ">" +
        "<td > " + "<img width='50' height='50' src=" + imagepath + ">" + "</td>" +
        "<td >" + doc.data().order_id + "</td>" +
        "<td>" + doc.data().product_name + "</td>" +
        "<td>" + doc.data().product_type + "</td>" +
        "<td>" + doc.data().product_color + "</td>" +
        "<td>" + doc.data().product_price + "</td>" +
        "<td>" + date + "</td>" +
        "<td>" +
        "<button class='btn btn-edit'>Edit</button>" +
        "<button class='btn btn-delete'>Delete</button>" +
        "</td>" +
        "</tr>"
    )).draw(true);

    // Click edit user
    const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
    if (btnEdit != null) {
        btnEdit.addEventListener('click', () => {
            editModal.classList.add('modal-show');
            //alert("i am called");
            id = doc.id;
            editModalForm.product_name.value = doc.data().product_name;
            editModalForm.product_type.value = doc.data().product_type;
            editModalForm.product_color.value = doc.data().product_color;
            editModalForm.product_price.value = doc.data().product_price;

        });
    }

    // Click delete user
    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    if (btnDelete != null) {
        btnDelete.addEventListener('click', () => {
            db.collection('Orders').doc(doc.id).delete().then(() => {
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
    if (e.target === addModal) {
        addModal.classList.remove('modal-show');
    }
    if (e.target === editModal) {
        editModal.classList.remove('modal-show');
    }
});

// Get all Orders
db.collection('Orders').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
        //renderUser(doc);
        console.log(doc.data());
    })
});



// Real time listener
db.collection('Orders').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            renderUser(change.doc);
        }
        if (change.type === 'removed') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            table.row(tr).remove();
            table.rows().draw();
        }
        if (change.type === 'modified') {
            let tr = document.querySelector(`[data-id='${change.doc.id}']`);
            table.row(tr).remove();
            renderUser(change.doc);
        }
    })
})

// Click submit in add modal

// addModalForm.addEventListener('submit', e => {
//   e.preventDefault();

//   var docRef=db.collection('Orders').doc();
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
    db.collection('Orders').doc(id).update({
        product_name: editModalForm.product_name.value,
        product_color: editModalForm.product_color.value,
        product_type: editModalForm.product_type.value,
        product_price: editModalForm.product_price.value,

    });
    editModal.classList.remove('modal-show');

});