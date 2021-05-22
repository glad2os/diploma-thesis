let inputs = document.querySelectorAll('input');

function signup(event, btn) {
    event.preventDefault();

    if (inputs[0].value.length < 3 || inputs[1].value.length < 5 || inputs[2].value.length < 5 || !inputs[3].checked) {
        alert("Поля не введены!");
        return;
    }

    if (inputs[1].value.length < 5 !== inputs[2].value.length < 5) {
        return;
    }

    getJson("user/signin", {
        "username": inputs[0].value,
        "password": inputs[1].value
    }).then(resp => {
        if (resp.status === 200) {
            window.location.href = '/server';
        } else {
            alert(resp.json().error);
        }
    });
}