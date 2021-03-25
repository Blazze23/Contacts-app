const polja = document.querySelectorAll("input");

function registracija() {
   let greska = 0;
   console.log(polja);
   for (let i = 0; i < polja.length; i++) {
      if(polja[i].value.length == 0) {
          greska++
          polja[i].classList.add("is-invalid");
          polja[i].classList.remove("is-valid");
      } else {
          polja[i].classList.remove("is-invalid");
          polja[i].classList.add("is-valid");
      }
   }
   if(greska > 0) {
       return false;
   }
   const email = $("#email").val();
   if(email.indexOf("@") == -1) {
    swal.fire("Oops...", "Please enter valid email address", "error");
    polja[1].classList.remove("is-valid");
    polja[1].classList.add("is-invalid");
    return false;
   }
   const password = $("#password").val();
   const rptpassword = $("#rptpassword").val();
   if(password != rptpassword) {
       swal.fire("Oops...", "Passwords do not match", "error");
       polja[2].classList.remove("is-valid");
       polja[3].classList.remove("is-valid");
       polja[2].classList.add("is-invalid");
       polja[3].classList.add("is-invalid");
       return false;
   }
   const username = $("#username").val();
   const korisnik = new Korisnik(username, email, password);
   const json_korisnik = JSON.stringify(korisnik);

   $.post( "http://obrada.in.rs/api/registracija", json_korisnik, function( data ) {
   if(data.sifra == 0) {
    swal.fire("Greska", data.poruka, "error");
   } else {
       swal.fire("Info", data.poruka, "success");
       ocisti();
   }
  }); 
}

$("#rptpassword").keyup(function(event) {
    if(event.keyCode === 13) {
       registracija();
    }
 })

function Korisnik(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
}

function ocisti() {
    for(let i = 0; i<polja.length; i++ ) {
        polja[i].value = "";
        polja[i].classList.remove("is-valid");
        polja[i].classList.remove("is-invalid");
    }
}