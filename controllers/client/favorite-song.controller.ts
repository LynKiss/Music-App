
import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
// [GET] /favorite-song
export const index = async (req: Request, res: Response) => {
  const favoriteSong = await FavoriteSong.find({
    // userId: "",
    deleted: false,
  }).lean();

  const favoriteSongsFinal = [];

  for (const item of favoriteSong) {
    const infoSong = await Song.findOne({
      _id: item.songId,
    }).lean();

    if (!infoSong) {
      continue;
    }

    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId,
    }).lean();

    favoriteSongsFinal.push({
      ...item,
      infoSong,
      infoSinger,
    });
  }

  res.render("client/pages/favorite-song/index.pug", {
    pageTitle: "Bai hat yeu thich",
    favoriteSong: favoriteSongsFinal,
  });
};
