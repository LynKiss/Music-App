// tinymce.init({
//   selector: "textarea",
//   license_key: "gpl",
// });

tinymce.init({
  selector: "textarea",

  // Plugins cần thiết
  plugins: "image code table link",
  // Thêm table để resize ảnh tốt hơn

  // Thanh công cụ
  toolbar:
    "undo redo | bold italic | alignleft aligncenter alignright | image | code",

  // Cho phép upload ảnh từ data URLs
  automatic_uploads: true,

  // Chỉ mở picker cho ảnh
  file_picker_types: "image",

  // Cấu hình resize ảnh
  image_resize: true,
  image_advtab: true,
  image_class_list: [
    { title: "None", value: "" },
    { title: "Responsive", value: "img-fluid" },
  ],

  // Hàm xử lý khi chọn file ảnh
  file_picker_callback: function (cb, value, meta) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = function () {
      const file = this.files[0];

      const reader = new FileReader();
      reader.onload = function () {
        // Tạo blob id duy nhất
        const id = "blobid" + new Date().getTime();
        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);

        // Thêm blob vào cache
        blobCache.add(blobInfo);

        // Gọi callback của TinyMCE để chèn ảnh
        cb(blobInfo.blobUri(), { title: file.name });
      };

      reader.readAsDataURL(file);
    };

    input.click();
  },

  // Tùy chọn style nội dung
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }",
});
