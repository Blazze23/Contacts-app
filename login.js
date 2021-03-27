const polja = $("input");

function login() {
   let greska = 0;
  for(let i = 0; i<polja.length; i++) {
   if(polja[i].value == "") {
      polja[i].classList.remove("is-valid");
      polja[i].classList.add("is-invalid");
      greska++
   } else {
      polja[i].classList.remove("is-invalid");
      polja[i].classList.add("is-valid");
   }
  }
  if(greska>0) {
     return false;
  }
  const username = $("#username").val();
  const password = $("#password").val();
  const korisnik = new Korisnik(username, password);
  const json_korisnik = JSON.stringify(korisnik);
  $.post("https://obrada.in.rs/api/login", json_korisnik, function(data) {
    
     if(data.sifra == 0) {
        swal.fire("Error", "Something went wrong...", "error");
     } else {
         localStorage.setItem("token", data.token);
         localStorage.setItem("username", data.korisnik.username);
         localStorage.setItem("public", data.korisnik.public);
         ocisti();
         location.href="index.html";
     }
  })
}

$("#password").keyup(function(event) {
   if(event.keyCode === 13) {
      login();
   }
})

function Korisnik(username, password) {
   this.username = username;
   this.password = password;
}

function ocisti() {
   for(let i = 0; i<polja.length; i++) {
      polja[i].value = "";
      polja[i].classList.remove("is-valid");
      polja[i].classList.remove("is-invalid");
   }
}