import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertSlug";

// [GET] /search/:type"
export const result = async (req: Request, res: Response) => {
  const type = req.params.type
  const keyword: string = `${req.query.keyword || ""}`;
  const newSongs = [];

  if (keyword) {
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
        id: item._id.toString(),
        title: item.title,
        avatar: item.avatar,
        like: item.like,
        slug: item.slug,
        infoSinger: {
          fullName: infoSinger ? infoSinger.fullName : "",
        },
      });
    }
  }
  switch (type) {
    case "result":
      res.render("client/pages/search/result.pug", {
        pageTitle: `Ket qua tim kiem : ${keyword}`,
        keyword,
        songs: newSongs,
      });
      break;
    case "suggest":
      res.json({
        code: 200,
        message: "Thành công",
        songs: newSongs
      })

      break;

    default:
      break;
  }

};
