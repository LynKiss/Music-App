// APlayer
const aplayer = document.querySelector("#aplayer");
const disc = document.querySelector(".singer-detail .inner-avatar");

if (aplayer && typeof APlayer !== "undefined") {
  const songRaw = aplayer.getAttribute("data-song");
  const singerRaw = aplayer.getAttribute("data-singer");

  if (songRaw) {
    const dataSong = JSON.parse(songRaw);
    const dataSinger = singerRaw ? JSON.parse(singerRaw) : null;

    const ap = new APlayer({
      container: aplayer,
      audio: [
        {
          name: dataSong.title,
          artist: dataSinger ? dataSinger.fullName : "Dang cap nhat",
          url: dataSong.audio,
          cover: dataSong.avatar,
        },
      ],
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
