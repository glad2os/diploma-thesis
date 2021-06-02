let myDropzone = new Dropzone("#imgzone", { // Make the whole body a dropzone
    url: "/api/uploadfile/addServerImg", // Set the url
    autoQueue: false,
    previewTemplate: document.getElementById('dz-preview').innerHTML,
    acceptedFiles: ".jpeg,.jpg,.png,.gif"
});

myDropzone.on("totaluploadprogress", function (progress) {
    document.querySelector(".progress-bar").style.width = progress + "%";
});

myDropzone.on("sending", function(file, xhr, formData) {
    formData.append("filename", document.getElementById("serverinput").value);
});

function upload() {
    if (document.getElementById("serverinput").value.length > 2) {
        getJson("servers/regServer", {
            "name": document.getElementById("serverinput").value,
            "img_path": myDropzone.files.length
        }).then(resp => {
            document.getElementById('tbody').innerHTML = "";
            if (resp.status === 200) {
                if (myDropzone.files.length > 0) {
                    myDropzone.enqueueFile(myDropzone.files[0]);
                }
                get_all();
                updateStatusLabel();
            } else {
                alert(resp.json().error);
            }
        });
    } else {
        alert("Не указано название сервера")
    }
}
