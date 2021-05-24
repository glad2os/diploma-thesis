let inputs = document.querySelectorAll('input');

function signup(event, btn) {
    event.preventDefault();

    if (inputs[0].value.length < 3 || inputs[1].value.length < 5) {
        alert("Поля не введены!");
        return;
    }

    getJson("user/signin", {
        "username": inputs[0].value,
        "password": inputs[1].value
    }).then(resp => {
        if (resp.status === 200) {
            window.location.href = '/server';
        } else {
            resp.json().then(r => alert(r.error));
        }
    });
}