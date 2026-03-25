// tinymce.init({
//   selector: "textarea",
//   license_key: "gpl",
// });

tinymce.init({
  // Chỉ áp TinyMCE cho các textarea có class "editor".
  // Như vậy trường lyrics vẫn là text thuần để nhập định dạng LRC chạy theo nhạc.
  selector: "textarea.editor",

  // Plugins cần thiết
  plugins: "image code table link",
  // Thêm table để resize ảnh tốt hơn

  // Thanh công cụ
  toolbar:
    "undo redo | bold italic | alignleft aligncenter alignright | image | code",

  automatic_uploads: true,
  file_picker_types: "image",
  image_resize: true,
  image_advtab: true,
  image_class_list: [
    { title: "None", value: "" },
    { title: "Responsive", value: "img-fluid" },
  ],

  // Route /admin/upload sẽ nhận file, upload lên Cloudinary
  // rồi trả lại { location: "https://..." } cho TinyMCE.
  images_upload_handler: async (blobInfo) => {
    // blobInfo là file ảnh người dùng vừa chèn trong editor.
    // Mình tạo FormData để gửi file này sang backend giống một form upload thông thường.
    const formData = new FormData();
    formData.append("file", blobInfo.blob(), blobInfo.filename());

    const response = await fetch("/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload image failed");
    }

    // Backend trả về { location: urlCloudinary }.
    // TinyMCE sẽ tự lấy URL này để chèn <img src="..."> vào nội dung.
    const result = await response.json();
    return result.location;
  },
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }",
});
