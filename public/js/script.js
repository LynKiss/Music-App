// APlayer
const aplayer = document.querySelector("#aplayer");
const disc = document.querySelector(".singer-detail .inner-avatar");

if (aplayer && typeof APlayer !== "undefined") {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
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
// End APlayer
