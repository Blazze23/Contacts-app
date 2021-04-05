$(document).ready(function($) {
    initMap();
});

const privacy = localStorage.getItem("public");
const token = localStorage.getItem("token");
let kontaktiKorisnika = [];
function checkPrivacy() {
    if(privacy == 0) {
        Swal.fire({
            title: "Warring",
            text:"You have to change your profile privacy to public to view this page",
            icon:"warning",
            showOkButton: true,
            okButtonText: "OK"
        }).then(function() {
            location.href="profile.html";
        }); 
    }
}

function ucitajKontakte() {
    if(privacy != 0) {
        ucitajLokacijeKorisnika();
        $.getJSON("https://obrada.in.rs/api/sviKontakti/"+token, function(data) {
            console.log(data);
            $("#kontakti").empty();
            if (data.length == 0) {
              $("#kontakti").append(
                "<tr><td colspan='4' class='text-center'>No public contacts available</td></tr>"
              );
            } else {
              $.each(data, function (key, value) {
                $("#kontakti").append(
                  "<tr class='text-center'><td>" +
                    value.imeiprezime +
                    "</td><td>" +
                    value.telefon +
                    "</td><td>"+value.username+"</td><td><button class='btn btn-warning btn-sm' style='color: #0e3854' onclick='ownerInfo(" +
                    value.korisnik_id +
                    ")'><i class='fas fa-info-circle pe-2'></i>Details</button></td></tr>");
                $("#publicContacts").html(data.length);
              });
            }
        })
    }
}

function ownerInfo(id) {
    $.getJSON("https://obrada.in.rs/api/korisnikInfo/"+token+"/"+id, function(data) {
        console.log(data);
        $("#ownerInfo").modal("show");
        if(data.korisnik.img == "") {
            $("#ownerImg").attr("src", "img/user.jpg");
        } else {
            $("#ownerImg").attr("src", "https://obrada.in.rs/api/"+data.korisnik.img);
        }
        $("#ownerUsername").val(data.korisnik.username);
        $("#ownerEmail").val(data.korisnik.email);
        $("#ownerId").val(data.korisnik.id);
        $("#nubmerOfContacts").val(data.kontakti.length);
        kontaktiKorisnika.unshift(data.kontakti);
    })
}

function spremiOwnerContacts() {
    $("#ownerContacts").html("<div class='table-responsive'><table class='table table-borderless'><thead class='table-info'><tr class='text-center'><th scope='col'>Contact Name</th><th scope='col'>Phone Number</th></tr></thead><tbody class='text-center' id='tabelaKontakti'></tbody></table></div>");
    $("#btnOwnerContacts").css("display", "none");
    ownerContacts();
}

function ownerContacts() {
    $("#modalTitle").html("User Contacts");
    $("#tabelaKontakti").empty();
    $.each(kontaktiKorisnika[0], function(key, value) {
       $("#tabelaKontakti").append("<tr><td>"+value.imeiprezime+"</td><td>"+value.telefon+"</td></tr>");
    })
   
    console.log(kontaktiKorisnika[0]);
}

function ocistiModal() {
    kontaktiKorisnika = [];
    $("#modalTitle").html("User Information");
    $("#btnOwnerContacts").css("display", "block");
    $("#ownerContacts").html("<div class='text-center mb-5'><img src='img/user.jpg' alt='User Profile picture' id='ownerImg' class='img-fluid'></div><form action='' id='forma_izmena'><div class='mb-4'><label for='username' class='form-labe'>Username:</label><br /><input type='text' name='username' class='form-control' placeholder='Username...' id='ownerUsername' disabled/></div><div class='mb-4'><label for='email' class='form-label'>User email:</label><br /><input type='text' name='email' class='form-control' placeholder='User email...' id='ownerEmail'disabled/></div><div class='mb-4'><label for='ownerId' class='form-label'>User ID:</label><br /><input type='text' name='ownerId' class='form-control' placeholder='User ID...' id='ownerId'disabled/></div><div class='mb-4'><label for='nubmerOfContacts' class='form-label'>Number of Contacts:</label><br /><input type='text' name='nubmerOfContacts'class='form-control' placeholder='Number of Contacts...' id='nubmerOfContacts'disabled/></div></form></div>");
}

// pretraga rucno

function pretraga() {
    let br_tel = $("#search").val();
    const tabela =$("table tbody");
    if(br_tel.length == 0) {
        ucitajKontakte();
    } else {
        for(let i = 0; i<tabela[0].rows.length; i++) {
            console.log(br_tel);
            console.log(tabela[0].rows[i].cells[1].innerHTML);
            if(br_tel.includes(tabela[0].rows[i].cells[1].innerHTML)) {
                tabela[0].rows[i].style.display = "table-row";
            } else {
                tabela[0].rows[i].style.display = "none";
            }
        }
    }
}

// pretraga pomocu servera

function pretraga2(br_tel) {
    if(br_tel == 0) {
        ucitajKontakte();
    } else {
        $.getJSON("https://obrada.in.rs/api/ucitajKontakteSearch/"+token+"/"+br_tel, function(data) {
           $("table tbody").empty();
           $.each(data, function(key, value) {
               $("table tbody").append("<tr class='text-center'><td>"+value.imeiprezime+"</td><td>"+value.telefon+"</td><td>"+value.username+"</td><td><button class='btn btn-warning btn-sm' style='color: #0e3854' onclick='ownerInfo(" +
               value.korisnik_id +
               ")'><i class='fas fa-info-circle pe-2'></i>Details</button></td></tr>")
           });
        });
    }  
} 

// Google Maps

let map;
let markers = [];

      function initMap() {
        let lokacija = { lat: 44.8154033, lng: 20.2825132 };
        map = new google.maps.Map(document.getElementById("map"), {
          center: lokacija,
          zoom: 4,
        });
      }

function postaviMarker(lat, lon, id) {
    let lokacija = new google.maps.LatLng(lat, lon);
    let marker = new google.maps.Marker({
        position: lokacija,
        map: map,
        title: id
    });
    let infoWindow = new google.maps.InfoWindow({
        content: "<h4>User ID: "+id+"</h4><button class='btn btn-warning mt-3' style='color: #0e3854' onclick='ownerInfo(" +id+")'><i class='fas fa-info-circle pe-2'></i>User Info</button>"
    })
    marker.addListener('click', function() {
       infoWindow.open(map, marker);
    });
    markers.push(marker);
}


function ucitajLokacijeKorisnika() {
    $.getJSON("https://obrada.in.rs/api/korisniciInfoLokacija/"+token, function(data) {
       $.each(data, function(key, value) {
           if(value.lat != 0) {
               postaviMarker(value.lat, value.lon, value.id);
           }
       });
    });
}

// MAP korisne funkcije !!!

function setMapOnAll(map) {
    for(let i = 0; i<markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}