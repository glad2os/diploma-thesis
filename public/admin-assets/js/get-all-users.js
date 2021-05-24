const tbody = document.getElementById('tbody');

let limit = 0;
let amount = 5;

// getJson("", "").then(response => console.log(response));

async function countUsers() {
    return await fetch('/api/user/getCountUsers', {
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


function reg_user() {
    getJson("user/get-all", {
        "limit": limit,
        "amount": amount,
    }).then(response => response.json()).then(value => {
        if (typeof value.error === "undefined") {
            for (let i = 0; i < value.length; i++) {
                let tr = document.createElement('tr');
                let id = document.createElement('td');
                let login = document.createElement('td');
                let edit = document.createElement('td');
                let remove = document.createElement('td');
                let av_server = document.createElement('td');

                getJson("user/getAvailableServers", {
                    "username": value[i].username
                }).then(response => response.json()).then(value1 => {
                    for (let j = 0; j < value1.length; j++) {
                        av_server.innerHTML = av_server.innerHTML + "<br>" + value1[j].name;
                    }
                });

                id.innerText = value[i].id;
                login.innerText = value[i].username;

                let editIcon = document.createElement('i');
                let removeIcon = document.createElement('i');

                editIcon.classList.add('fas');
                editIcon.classList.add('fa-user-edit');

                removeIcon.classList.add('fas');
                removeIcon.classList.add('fa-user-times');

                edit.appendChild(editIcon);
                remove.appendChild(removeIcon);


                edit.onclick = function () {
                    window.location.href = "/admin/edituser?username=" + value[i].username;
                }

                tr.appendChild(id);
                tr.appendChild(login);
                tr.appendChild(av_server);
                tr.appendChild(edit);
                tr.appendChild(remove);
                tbody.appendChild(tr);
            }
        } else {
            console.log(value.error.code);
        }
    });
}

function prevPage() {
    if (limit - 5 >= 0) {
        tbody.innerHTML = "";
        limit -= 5;
        reg_user();
        updateStatusLabel();
    }
}

function nextPage() {
    countUsers().then(response => response.json()).then(value => {
        if (limit + 5 <= value.count) {
            tbody.innerHTML = "";
            limit += 5;
            reg_user();
            document.getElementById("dataTable_info").innerText = "Showing " + limit + " to 10 of " + value.count;
        }
    });
}

reg_user();
updateStatusLabel();
