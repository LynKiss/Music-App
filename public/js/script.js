// APlayer
const aplayer = document.querySelector("#aplayer");
const disc = document.querySelector(".singer-detail .inner-avatar");
const listenElement = document.querySelector(".singer-detail .inner-listen span");

if (aplayer && typeof APlayer !== "undefined") {
  const songRaw = aplayer.getAttribute("data-song");
  const singerRaw = aplayer.getAttribute("data-singer");

  if (songRaw) {
    const dataSong = JSON.parse(songRaw);
    const dataSinger = singerRaw ? JSON.parse(singerRaw) : null;

    const ap = new APlayer({
      container: aplayer,
      lrcType: 1,
      audio: [
        {
          name: dataSong.title,
          artist: dataSinger ? dataSinger.fullName : "Dang cap nhat",
          url: dataSong.audio,
          cover: dataSong.avatar,
          lrc: dataSong.lyrics || "",
        },
      ],
      autoplay: true,
      volume: 0.8,
    });

    ap.on("play", () => {
      if (disc) {
        disc.classList.add("is-playing");
      }
    });

    ap.on("pause", () => {
      if (disc) {
        disc.classList.remove("is-playing");
      }
    });

    ap.on("ended", () => {
      if (disc) {
        disc.classList.remove("is-playing");
      }

      const link = `/songs/listen/${dataSong._id}`;

      fetch(link, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code !== 200) {
            return;
          }

          if (listenElement) {
            listenElement.innerHTML = `${data.listen} Luot nghe`;
          }
        })
        .catch((error) => {
          console.error("Listen failed:", error);
        });
    });
  }
}
// End APlayer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if (buttonLike) {
  const idSong = buttonLike.getAttribute("button-like");
  const span = buttonLike.querySelector("span");
  const localStorageKey = `liked_${idSong}`;

  if (localStorage.getItem(localStorageKey) === "true") {
    buttonLike.classList.add("active");
  }

  buttonLike.addEventListener("click", () => {
    const isActive = buttonLike.classList.contains("active");
    const typeLike = isActive ? "dislike" : "like";
    const link = `/songs/like/${typeLike}/${idSong}`;

    fetch(link, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code !== 200) {
          return;
        }

        if (span) {
          span.innerHTML = `${data.like} Thich`;
        }

        buttonLike.classList.toggle("active", typeLike === "like");

        if (typeLike === "like") {
          localStorage.setItem(localStorageKey, "true");
        } else {
          localStorage.removeItem(localStorageKey);
        }
      })
      .catch((error) => {
        console.error("Like failed:", error);
      });
  });
}
// End Button Like

// Button Favorite
const ListButtonFavorite = document.querySelectorAll("[button-favorite]");
if (ListButtonFavorite.length > 0) {
  ListButtonFavorite.forEach((buttonFavorite) => {
    const icon = buttonFavorite.querySelector("i");

    if (icon) {
      icon.classList.toggle("fa-solid", buttonFavorite.classList.contains("active"));
      icon.classList.toggle("fa-regular", !buttonFavorite.classList.contains("active"));
    }

    buttonFavorite.addEventListener("click", () => {
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const isActive = buttonFavorite.classList.contains("active");

      const typeFavorite = isActive ? "unfavorite" : "favorite";
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;

      fetch(link, {
        method: "PATCH",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code !== 200) {
            return;
          }

          buttonFavorite.classList.toggle("active", typeFavorite === "favorite");

          if (icon) {
            const isFavorite = typeFavorite === "favorite";
            icon.classList.toggle("fa-solid", isFavorite);
            icon.classList.toggle("fa-regular", !isFavorite);
          }
        })
        .catch((error) => {
          console.error("Favorite failed:", error);
        });
    });
  });
}
// End Button Favorite

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const input = boxSearch.querySelector("input[name='keyword']");
  const boxSuggest = boxSearch.querySelector(".inner-suggest");

  if (input && boxSuggest) {
    input.addEventListener("keyup", () => {
      const keyword = input.value.trim();

      if (!keyword) {
        boxSuggest.innerHTML = "";
        boxSuggest.classList.remove("show");
        return;
      }

      const link = `/search/suggest?keyword=${encodeURIComponent(keyword)}`;

      fetch(link)
        .then((res) => res.json())
        .then((data) => {
          if (data.code !== 200 || !Array.isArray(data.songs) || data.songs.length === 0) {
            boxSuggest.innerHTML = "";
            boxSuggest.classList.remove("show");
            return;
          }

          const htmls = data.songs.map((song) => `
            <a class="inner-item" href="/songs/detail/${song.slug}">
              <div class="inner-image">
                <img src="${song.avatar}" alt="${song.title}">
              </div>
              <div class="inner-info">
                <div class="inner-title">${song.title}</div>
                <div class="inner-singer">
                  <i class="fa-solid fa-microphone-lines"></i>
                  ${song.infoSinger.fullName}
                </div>
              </div>
            </a>
          `);

          boxSuggest.innerHTML = htmls.join("");
          boxSuggest.classList.add("show");
        })
        .catch((error) => {
          boxSuggest.innerHTML = "";
          boxSuggest.classList.remove("show");
          console.error("Suggest failed:", error);
        });
    });
  }
}
// End Search Suggest

// Upload Image Preview
const uploadImageInput = document.querySelector("[upload-image-input]");
const uploadImagePreview = document.querySelector("[upload-image-preview]");

if (uploadImageInput && uploadImagePreview) {
  // Với trang edit, nếu ảnh cũ đã có sẵn src thì hiện preview ngay khi load trang.
  if (
    uploadImagePreview.getAttribute("src") &&
    uploadImagePreview.getAttribute("src") !== ""
  ) {
    uploadImagePreview.classList.add("show");
  }

  uploadImageInput.addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files && input.files[0];

    if (!file) {
      // Nếu người dùng bỏ chọn file thì xóa preview hiện tại.
      uploadImagePreview.setAttribute("src", "");
      uploadImagePreview.classList.remove("show");
      return;
    }

    // URL.createObjectURL tạo ra một URL tạm từ file local
    // để browser có thể hiển thị preview trước khi file được upload thật.
    uploadImagePreview.setAttribute("src", URL.createObjectURL(file));
    uploadImagePreview.classList.add("show");
  });
}
// End Upload Image Preview

// Upload Audio Preview
const uploadAudioInput = document.querySelector("[upload-audio-input]");
const uploadAudioPreview = document.querySelector("[upload-audio-preview]");

if (uploadAudioInput && uploadAudioPreview) {
  const currentSrc = uploadAudioPreview.getAttribute("src");

  // Với trang edit, nếu audio cũ đã tồn tại thì hiện player ngay.
  if (currentSrc) {
    uploadAudioPreview.classList.add("show");
  }

  uploadAudioInput.addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files && input.files[0];

    if (!file) {
      // Không còn file thì xóa source cũ và reset player.
      uploadAudioPreview.removeAttribute("src");
      uploadAudioPreview.classList.remove("show");
      uploadAudioPreview.load();
      return;
    }

    // Gán file local vào thẻ audio để người dùng nghe thử ngay
    // trước khi middleware upload file đó lên Cloudinary.
    uploadAudioPreview.setAttribute("src", URL.createObjectURL(file));
    uploadAudioPreview.classList.add("show");
    // load() buộc thẻ audio đọc lại source mới vừa được gán.
    uploadAudioPreview.load();
  });
}
// End Upload Audio Preview
