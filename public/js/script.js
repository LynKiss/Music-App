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
          artist: dataSinger ? dataSinger.fullName : "Đang cập nhật",
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
          span.innerHTML = `${data.like} Thích`;
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
