$(document).ready(function($) {
    initMap();
});

const token = localStorage.getItem("token");
let public_info;
let image = "";
const polja = $("form input");
function ucitajKorisnika() {
    $.getJSON("https://obrada.in.rs/api/korisnikInfo/"+token, function(data) {
        console.log(data);
       $("#id_info").val(data[0].id);
       $("#username_info").val(data[0].username);
       $("#email_info").val(data[0].email);
       $("#contacts_number").val(data.ukupno_kontakata);
       console.log(data[0].img.length);
       if(data[0].img.length == 0) {
           $("#profilePicture").attr("src", "img/user.jpg");
       } else {
            $("#profilePicture").attr("src", "https://obrada.in.rs/api/"+data[0].img);
       }
       let public = parseInt(data[0].public);
       public_info = public;
       if(public_info == 0) {
        $("#privacy").removeClass("alert-success");
        $("#privacy").addClass("alert-danger");
        $("#privacy").html("<i class='fas fa-eye-slash pe-2'></i><b>Private</b>");
       } else {
        $("#privacy").addClass("alert-success");
        $("#privacy").removeClass("alert-danger");
        $("#privacy").html("<i class='fas fa-eye pe-2'></i><b>Public</b>");
       }
       if(data[0].lat !=0) {
           setMarker(data[0].lat, data[0].lon);
       }
    });
}

function changePrivacy() {
    if(public_info == 0) {
        var prosledi = 1;
    } else {
        var prosledi = 0;
    }
    $.getJSON("https://obrada.in.rs/api/deljenjeKorisnik/"+token+"/"+prosledi, function(data) {
        // console.log(data);
        if(data.sifra == 0) {
            swal.fire("Error", "Something went wrong...", "error");
            return false;
        }
        localStorage.setItem("public", prosledi);
        ucitajKorisnika();
    })
}

function changePassword() {
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
    const oldpasswod = $("#oldpassword").val();
    const newpassword = $("#newpassword").val();
    const rptpassword = $("#rptpassword").val();
    if(newpassword != rptpassword) {
        swal.fire("Error", "Passwords do not match", "error");
        polja[1].classList.remove("is-valid");
        polja[2].classList.remove("is-valid");
        polja[1].classList.add("is-invalid");
        polja[2].classList.add("is-invalid");
        return false;
    }
    const lozinka = new Password(oldpasswod, newpassword);
    const json_lozinka = JSON.stringify(lozinka);
    $.post( "https://obrada.in.rs/api/izmeniLozinku/"+token, json_lozinka, function( data ) {
        if(data.sifra == 0) {
         swal.fire("Error", "Something went wrong...", "error");
        } else {
            swal.fire("Info", "You have successfully changed password!", "success");
            ocisti();
        }
       }); 
}

$("#rptpassword").keyup(function(event) {
    if(event.keyCode === 13) {
       changePassword();
    }
 })

function Password(oldpassword, newpassword) {
    this.staralozinka = oldpassword;
    this.novalozinka = newpassword;
}

function ocisti() {
    for(let i = 0; i<polja.length; i++ ) {
        polja[i].value = "";
        polja[i].classList.remove("is-valid");
        polja[i].classList.remove("is-invalid");
    }
}

function changePictureModal() {
    $("#profileModal").modal("show");
}

function readImage(input) {
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log(e);
        $("#profilePictureModal").attr("src", e.target.result);
        image = e.target.result;
        console.log(image);
    }
    // ova funkcija radi pretvaranje slike u base64
    reader.readAsDataURL(input.files[0]);
}

function Photo(photo) {
    this.image = photo;
}

function changePhoto() {
    if(image.length == 0) {
        swal.fire("Error", "You need to choose a profile picture", "error");
    } else {
        const photo = new Photo(image);
        const json_slika = JSON.stringify(photo);
        $.post("https://obrada.in.rs/api/dodajSliku/"+token, json_slika, function(data) {
            if(data.sifra == 0) {
                Swal.fire("Error", "Something went wrong...", "error");
            } else {
                Swal.fire("Info", "You have successfully changed your profile picture!", "success");
                ucitajKorisnika();
                $("#profileModal").modal("hide");
                image = "";
                $("#profilePictureModal").attr("src", "img/user.jpg");
                $("#pictureInput").val("");
            }
        })
    }
}

// Google Maps

let map;
let marker;


      function initMap() {
        let lokacija = { lat: 44.8154033, lng: 20.2825132 };
        map = new google.maps.Map(document.getElementById("map"), {
          center: lokacija,
          zoom: 9,
        });

        // map.addListener("click", () => {
        //     // 3 seconds after the center of the map has changed, pan back to the
        //     // marker.
        //    alert("Clicked")
        //   });

          google.maps.event.addListener(map, "click", (event)=> {
              console.log(event.latLng.lat(), event.latLng.lng());
              setMarker(event.latLng.lat(), event.latLng.lng(), 1);
          });
      }

      function postaviCentar(lat, lon) {
        let lokacija = new google.maps.LatLng(lat, lon);
          map.setCenter(lokacija);
      }

      function setMarker(lat, lon, listener=0) {
            let lokacija = new google.maps.LatLng(lat, lon);
            if(marker == null) {
                marker = new google.maps.Marker({
                    position: lokacija,
                    map: map,
                    title: "Smiley location"
                });
            } else {
                marker.setPosition(lokacija);
            }
            if(listener != 0) {
                izmeniLokaciju(lat, lon);
            } else {
                postaviCentar(lat, lon);
            }
      }

      function Lokacija(lat, lon) {
        this.lat = lat;
        this.lon = lon;
      }

      function izmeniLokaciju(lat, lon) {

        let lokacija = new Lokacija(lat, lon);
        let json_lokacija = JSON.stringify(lokacija);
        $.post( "https://obrada.in.rs/api/dodajLokaciju/"+token, json_lokacija, function( data ) {
            if(data.sifra == 0) {
             swal.fire("Error", "Something went wrong...", "error");
            } else {
                swal.fire("Info", "Your location has been successfully set", "success");
            }
           }); 
      }