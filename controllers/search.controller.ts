import { Request, Response } from "express";
import Song from "../models/song.model";
import Singer from "../models/singer.model";
import { convertToSlug } from "../helpers/convertSlug";

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
  const keyword: string = `${req.query.keyword || ""}`;
  const newSongs = [];

  if (keyword) {
    const regex = new RegExp(keyword, "i");

    // Tạo slug không dấu ,có dấu - ngăn cách
    const stringSlug = convertToSlug(keyword);
    const titleRegex = new RegExp(keyword, "i");
    const slugRegex = new RegExp(stringSlug, "i");

    const songs = await Song.find({
      $or: [
        { title: titleRegex },
        { slug: slugRegex }
      ],
      deleted: false,
      status: "active",
    }).lean();


    for (const item of songs) {
      const infoSinger = await Singer.findOne({
        _id: item.singerId,
        deleted: false,
        status: "active",
      }).lean();

      newSongs.push({
        ...item,
        infoSinger,
      });
    }
  }

  res.render("client/pages/search/result.pug", {
    pageTitle: `Ket qua tim kiem : ${keyword}`,
    keyword,
    songs: newSongs,
  });
};
