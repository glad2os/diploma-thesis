function reg_user() {
    getJson("user/reguser", {
        "username": document.getElementById("exampleInputEmail").value,
        "password": document.getElementById("examplePasswordInput").value,
    }).then(resp => {
        if (resp.status === 200) {
            alert("done!");
            window.location.href = '/admin/reguser';
        } else {
            alert(resp.json().error);
        }
    });
}