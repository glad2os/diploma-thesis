let myDropzone = new Dropzone("#messages", {
    url: "/api/uploadfile",
    uploadMultiple: true,
    previewTemplate: document.getElementById('dz-preview').innerHTML,
    success: function (file) {
        let filetype = file.type;
        let filename = file.name;
        socket.emit('file', {filetype, filename});
    }
});
