$(document).ready(function(){
    var str;
    //$("#phone").val();

     $("#sign_In_Btn").click(function(){
        
        
         //$("#btn").html("index");
         var email = $("#usr_email").val();
         var pass = $("#pass").val();
         //alert(pass);
        // $("#btn").html(str);
        //window.location.href="submit.html" ;

        firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((user) => {
        // Signed in
            //alert('Signed In');
            window.location.href="Index.html" ;
        })

    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Wrong Password or Email');
        window.location.href="signIn.html" ;
        });
            
     });


     

    });
    