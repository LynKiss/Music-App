import { Request, Response } from "express";
import Topic from "../models/topic.model";
import Song from "../models/song.model";
import Singer from "../models/singer.model";

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
  });

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

  res.render("client/pages/songs/detail.pug", {
    pageTitle: "Trang chi tiết bài hát",
    song: song,
    singer: infoSinger,
    topic: topic,
  });
};
// [PATCH] /songs/:typeLike/yes/:idSong
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
  const currentLike:number = typeLike === "like" ? likeValue + 1 : Math.max(likeValue - 1, 0);

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
