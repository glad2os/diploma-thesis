const tbody = document.getElementById('tbody');

let limit = 0;
let amount = 5;

async function countUsers() {
    return await fetch('/api/servers/getCountServers', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });
}

function updateStatusLabel() {
    countUsers().then(response => response.json()).then(value => {
        document.getElementById("dataTable_info").innerText = "Showing " + limit + " to 10 of " + value.count;
    });
}

function get_all() {
    getJson("servers/get-all", {
        "limit": limit,
        "amount": amount,
    }).then(response => response.json()).then(value => {
            if (typeof value.error === "undefined") {
                for (let i = 0; i < value.length; i++) {
                    let tr = document.createElement('tr');
                    let id = document.createElement('td');
                    let name = document.createElement('td');
                    let img_path = document.createElement('td');
                    let edit = document.createElement('td');
                    let remove = document.createElement('td');

                    id.innerText = value[i].id;
                    name.innerText = value[i].name;
                    img_path.innerHTML = value[i].img_path;

                    let removeIcon = document.createElement('i');

                    removeIcon.classList.add('fas');
                    removeIcon.classList.add('fa-user-times');

                    remove.appendChild(removeIcon);

                    remove.onclick = function () {
                        getJson('servers/remove/' + value[i].id, {}).then(resp => {
                            location.reload();
                        });
                    }
                    tr.appendChild(id);
                    tr.appendChild(name);
                    tr.appendChild(img_path);
                    tr.appendChild(remove);
                    tbody.appendChild(tr);
                }
            } else {
            }
        }
    );
}

function prevPage() {
    if (limit - 5 >= 0) {
        tbody.innerHTML = "";
        limit -= 5;
        get_all();
        updateStatusLabel();
    }
}

function nextPage() {
    countUsers().then(response => response.json()).then(value => {
        if (limit + 5 <= value.count) {
            tbody.innerHTML = "";
            limit += 5;
            get_all();
            document.getElementById("dataTable_info").innerText = "Showing " + limit + " to 10 of " + value.count;
        }
    });
}

get_all();
updateStatusLabel();
