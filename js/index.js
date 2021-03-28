var firebaseConfig = {
    apiKey: "AIzaSyCc0rlBmYYiFcQZLUpZR4OClB9d05jwOc4",
    authDomain: "ar-based-e-commerce.firebaseapp.com",
    projectId: "ar-based-e-commerce",
    storageBucket: "ar-based-e-commerce.appspot.com",
    messagingSenderId: "1048491425341",
    appId: "1:1048491425341:web:b173ca8d668b374d4d7454",
    measurementId: "G-PSS4Q56LYB"
    };
    firebase.initializeApp(firebaseConfig);
    var totalPrice=0;
    var totalOrder=0;
    var totalUsers=0;
    var totalProducts=0;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
        } else {
            window.location.href="signIn.html" ;
        }
      });
    $(document).ready(function(){

        $("#logOUtBtn").click(function(){

            firebase.auth().signOut().then(function() {
                //alert('Signed Out');
                window.location.href="signIn.html";
            
            }).catch(function(error) {
                // An error happened.
            
            });

        });
        var db= firebase.firestore();
        db.collection('Orders').get().then(querySnapshot => {
            totalOrder=querySnapshot.size;
            querySnapshot.forEach(doc => {
                var data=doc.data();

                totalPrice+=parseInt(data.product_price, 10);
            }); 

       
            $("#total_orders").html(totalOrder);
            $("#total_price").html(totalPrice);
          
        });

        db.collection('Users').get().then(querySnapshot => {
            totalUsers=querySnapshot.size;
            $("#total_users").html(totalUsers);
        });

        db.collection('AllProducts').get().then(querySnapshot => {
            totalProducts=querySnapshot.size;
            $("#total_products").html(totalProducts);
        });
        
       
    });
   