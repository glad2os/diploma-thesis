let inputs = document.querySelectorAll('input');

async function getJson(data = {}) {
    const response = await fetch('/api/user/signin', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
}

function signup(event, btn) {
    event.preventDefault();

    if (inputs[0].value.length < 3 || inputs[1].value.length < 5 || inputs[2].value.length < 5 || !inputs[3].checked) {
        return;
    }

    if (inputs[1].value.length < 5 !== inputs[2].value.length < 5) {
        return;
    }

    getJson({
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