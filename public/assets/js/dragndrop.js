let myDropzone = new Dropzone("#messages", {
    url: "/api/uploadfile",
    uploadMultiple: true,
    success: function (file) {
        let filetype = file.type;
        let filename = file.name;
        socket.emit('file', {filetype, filename});
    }
});
