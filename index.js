const polje = $("#forma_unos input");
const token = localStorage.getItem("token");
// Ova promenljiva se koristi za funkciju izmeniKontakt(), da bi se preko nje uhvatio ID kontakta za izmenu
let kontakt_izmena_id = 0;

function dodajKontakt() {
  let greska = 0;
  for (let i = 0; i < polje.length; i++) {
    if (polje[i].value.length == "") {
      greska++;
      polje[i].classList.remove("is-valid");
      polje[i].classList.add("is-invalid");
    } else {
      polje[i].classList.remove("is-invalid");
      polje[i].classList.add("is-valid");
    }
  }
  if (greska > 0) {
    return false;
  }
  const imeiprezime = $("#imeiprezime").val();
  const telefon = $("#telefon").val();
  const kontakt = new Kontakt(imeiprezime, telefon);
  const json_kontakt = JSON.stringify(kontakt);
  $.post(
    "https://obrada.in.rs/api/dodajKontakt/" + token,
    json_kontakt,
    function (data) {
      console.log(data);
      if (data.sifra == 0) {
        swal.fire("Greska", data.poruka, "error");
      } else {
        swal.fire("Info", data.poruka, "success");
        ocisti();
        ucitajKontakte();
      }
    }
  );
}

function Kontakt(imeiprezime, telefon) {
  this.imeiprezime = imeiprezime;
  this.telefon = telefon;
}

function ocisti() {
  for (let i = 0; i < polje.length; i++) {
    polje[i].value = "";
    polje[i].classList.remove("is-valid");
    polje[i].classList.remove("is-invalid");
  }
}

$("#telefon").keyup(function (event) {
  if (event.keyCode === 13) {
    dodajKontakt();
  }
});

function ucitajKontakte() {
  $.get("https://obrada.in.rs/api/ucitajKontakte/" + token, function (data) {
    console.log(data);
    $("#imenik").empty();
    if (data.length == 0) {
      $("#imenik").append(
        "<tr><td colspan='4' class='text-center'>No contacts</td></tr>"
      );
    } else {
      $.each(data, function (key, value) {
        $("#imenik").append(
          "<tr class='text-center'><td>" +
            value.imeiprezime +
            "</td><td>" +
            value.telefon +
            "</td><td><button class='btn btn-warning btn-sm' style='color: #0e3854' onclick='spremiIzmenu(" +
            value.id +
            ")'><i class='fas fa-info-circle pe-2'></i>Details</button></td></td><td><button class='btn btn-danger btn-sm' onclick='obrisiKontakt(" +
            value.id +
            ")' style='color: #0e3854'><i class='fas fa-trash-alt pe-2 '></i>Remove</button></td></tr>"
        );
        // console.log(value);
      });
    }
  });
}

function obrisiKontakt(id) {
  $.get(
    "https://obrada.in.rs/api/obrisiKontakt/" + token + "/" + id,
    function (data) {
      console.log(data);
      if (data.sifra == 0) {
        swal.Fire("Greska", data.poruka, "error");
      } else {
        swal.fire("Info", data.poruka, "success");
        ucitajKontakte();
      }
    }
  );
}

// Nacin da se nadje kontakt za izmenu bez pomoci backend-a!

// function spremiIzmenu2(id) {
//   $("#contactModal").modal("show");
//   $.get("http://obrada.in.rs/api/ucitajKontakte/" + token, function (data) {
//     $("#imeiprezime_izmena").val(data.find((obj) => obj.id == id).imeiprezime);
//     $("#telefon_izmena").val(data.find((obj) => obj.id == id).telefon);
//   });
// }

// Nacin da se nadje kontakt za izmenu uz pomoc backend-a!
// ID se ovde hvata pomocu globalne promenljive kontakt_izmena_id

function spremiIzmenu(id) {
    $("#contactModal").modal("show");
  $.get("https://obrada.in.rs/api/kontaktInfo/"+token+"/"+id, function(data) {
       console.log(data);
       $("#imeiprezime_izmena").val(data.imeiprezime);
       $("#telefon_izmena").val(data.telefon);
       $("#vreme_upisa_izmena").val(data.vreme_upisa);
       kontakt_izmena_id = data.id;
  })
}

function predIzmenu() {
        $("#imeiprezime_izmena").removeAttr("disabled");
        $("#telefon_izmena").removeAttr("disabled");
        $("#btn_izmeniKontakt").removeClass("btn-warning");
        $("#btn_izmeniKontakt").addClass("btn-success text-white");
        $("#btn_izmeniKontakt").html("<i class='fas fa-save pe-2 text-white'></i>Save Contact");
        $("#btn_izmeniKontakt").attr("onclick", "izmeniKontakt()");
    }

function posleIzmene() {
    $("#imeiprezime_izmena").attr("disabled", true);
    $("#telefon_izmena").attr("disabled", true);
    $("#btn_izmeniKontakt").removeClass("btn-success text-white");
    $("#btn_izmeniKontakt").addClass("btn-warning");
    $("#btn_izmeniKontakt").html("<i class='fas fa-edit pe-2'></i>Edit Contact");
    $("#btn_izmeniKontakt").attr("onclick", "predIzmenu()");
}

function izmeniKontakt() {
    const polja = $("#forma_izmena input");
    let greska = 0;
    for(let i = 0; i < polja.length; i++) {
        if(polja[i].value.length == "") {
            greska++;
            polja[i].classList.remove("is-valid");
            polja[i].classList.add("is-invalid");
        } else {
            polja[i].classList.remove("is-invalid");
            polja[i].classList.add("is-valid");
        }
    }
    if(greska > 0) {
        return false;
    }
    polja.removeClass("is-valid");
    const kontakt = new Kontakt($("#imeiprezime_izmena").val(), $("#telefon_izmena").val());
    const json_kontakt = JSON.stringify(kontakt);
    if(kontakt_izmena_id != 0) {
        $.post("https://obrada.in.rs/api/izmeniKontakt/"+token+"/"+kontakt_izmena_id, json_kontakt, function(data) {
            console.log(data);
            if(data.sifra == 0) {
                swal.fire("Greska", data.poruka, "error");
            } else {
                $("#contactModal").modal("hide");
                swal.fire("Info", data.poruka, "success");
                ucitajKontakte();
                posleIzmene();
            }
        });
    }
}

$("#telefon_izmena").keyup(function(event) {
    if(event.keyCode === 13) {
      izmeniKontakt();
    }
 })

// function spremiIzmenu3(id) {
//   $("#contactModal").modal("show");
//   $.get(
//     "https://obrada.in.rs/api/kontaktInfo/" + token + "/" + id,
//     function (data) {
//       console.log(data);
//       $("#imeiprezime_izmena").val(data.imeiprezime);
//       $("#telefon_izmena").val(data.telefon);
//       $("#vreme_upisa_izmena").val(data.vreme_upisa);
//       $("#btn_izmeniKontakt").attr(
//         "onclick",
//         "izmeniKontakt2(" + data.id + ")"
//       );
//       $("#telefon_izmena").keyup(function (event) {
//         if (event.keyCode === 13) {
//           izmeniKontakt2(data.id);
//         }
//       });
//     }
//   );
// }


// function izmeniKontakt2(id) {
//   const polja = $("#forma_izmena input");
//   let greska = 0;
//   for (let i = 0; i < polja.length; i++) {
//     if (polja[i].value.length == "") {
//       greska++;
//       polja[i].classList.remove("is-valid");
//       polja[i].classList.add("is-invalid");
//     } else {
//       polja[i].classList.remove("is-invalid");
//       polja[i].classList.add("is-valid");
//     }
//   }
//   if (greska > 0) {
//     return false;
//   }
//   const kontakt = new Kontakt(
//     $("#imeiprezime_izmena").val(),
//     $("#telefon_izmena").val()
//   );
//   const json_kontakt = JSON.stringify(kontakt);
//   $.post(
//     "https://obrada.in.rs/api/izmeniKontakt/" + token + "/" + id,
//     json_kontakt,
//     function (data) {
//       console.log(data);
//       if (data.sifra == 0) {
//         swal.fire("Greska", data.poruka, "error");
//       } else {
//         $("#contactModal").modal("hide");
//         swal.fire("Info", data.poruka, "success");
//         ucitajKontakte();
//       }
//     }
//   );
// }
