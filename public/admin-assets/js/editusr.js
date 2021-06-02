function updateList() {
    document.querySelector('.form-select').innerHTML = "";
    getJson("servers/selectall", {}).then(response => response.json()).then(value1 => {
        let selector = document.querySelector('.form-select');
        for (let j = 0; j < value1.length; j++) {
            let option = document.createElement('option');
            option.innerText = value1[j].name;
            option.value = value1[j].id;
            selector.appendChild(option);
        }
    });
}

updateList();

async function updateUsrAv(username) {

    await getJson("servers/updatelist", {
        "username": username,
        "serversids": Array.from(document.querySelector('.form-select').selectedOptions).map(o => Number(o.value))
    }).then(value => alert("done!"));
}