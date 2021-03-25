function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    location.href="login.html";
}

function proveriToken() {
    const token = localStorage.getItem("token");
    if(token == null) {
        logout();
    } else {
        $.get("http://obrada.in.rs/api/proveriToken/"+token, function(data) {
            if(data.sifra == 0) {
                logout();
            }
        })
    }
}

setInterval(function() {
    proveriToken()
}, 10000);

function ucitaj() {
    $("#username").html(localStorage.getItem("username"));
}