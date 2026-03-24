import { Request, Response } from "express";
import Topic from "../models/topic.model";
import Song from "../models/song.model";
import Singer from "../models/singer.model";
import FavoriteSong from "../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    slug: req.params.slugTopic,
    status: "active",
    deleted: false,
  });

  if (!topic) {
    return res.status(404).send("Topic not found");
  }

  const songs = await Song.find({
    topicId: topic.id,
    status: "active",
    deleted: false,
  })
    .select("avatar title slug singerId like")
    .lean();

  const songsFinal = [];

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false,
    }).lean();

    songsFinal.push({
      ...song,
      infoSinger: infoSinger,
    });
  }

  res.render("client/pages/songs/list.pug", {
    pageTitle: topic.title,
    songs: songsFinal,
  });
};
// [GET] /songs/detail/slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong = req.params.slugSong as string;

  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false,
  }).lean();

  if (!song) {
    return res.status(404).send("Song not found");
  }

  const infoSinger = await Singer.findOne({
    _id: song.singerId,
    deleted: false,
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false,
  }).select("title");

  const songId = song._id.toString();

  const songFavorite = await FavoriteSong.findOne({
    songId: songId,
    deleted: false,
  });

  const songDetail = {
    ...song,
    id: songId,
    isFavoriteSong: !!songFavorite,
  };

  res.render("client/pages/songs/detail.pug", {
    pageTitle: "Trang chi tiết bài hát",
    song: songDetail,
    singer: infoSinger,
    topic: topic,
  });
};
// [PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong as string;
  const typeLike: string = req.params.typeLike as string;

  const song = await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false,
  });

  if (!song) {
    return res.status(404).json({
      code: 404,
      message: "Bài hát không tồn tại",
    });
  }

  const likeValue = song.like || 0;
  const currentLike: number = typeLike === "like" ? likeValue + 1 : Math.max(likeValue - 1, 0);

  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      like: currentLike,
    }
  );

  res.json({
    code: 200,
    message: "Thành công",
    like: currentLike,
  });
};

// [PATCH] /songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong as string;

  const song = await Song.findOne({
    _id: idSong,
    status: "active",
    deleted: false,
  });

  if (!song) {
    return res.status(404).json({
      code: 404,
      message: "Bài hát không tồn tại",
    });
  }

  const listenValue = song.listen || 0;
  const currentListen = listenValue + 1;

  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      listen: currentListen,
    }
  );

  res.json({
    code: 200,
    message: "Thành công",
    listen: currentListen,
  });
};
// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  const idSong: string = req.params.idSong as string;
  const typeFavorite: string = req.params.typeFavorite as string;

  switch (typeFavorite) {
    case "favorite":
      const exitsFavoriteSong = await FavoriteSong.findOne({
        songId: idSong
      });
      if (!exitsFavoriteSong) {
        const record = new FavoriteSong({
          // userId: "",
          songId: idSong
        })
        await record.save();
      }
      break
    case "unfavorite":
      await FavoriteSong.deleteOne({
        songId: idSong
      })
      break
    default:
      break
  }

  res.json({
    code: 200,
    message: "Thành công",

  });
};
