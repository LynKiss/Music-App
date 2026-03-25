import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import { convertToSlug } from "../../helpers/convertSlug";
import { normalizeLyrics } from "../../helpers/normalizeLyrics";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";

// [GET] /admin/songs
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  const singerIds = songs.map((item) => item.singerId).filter(Boolean);
  const topicIds = songs.map((item) => item.topicId).filter(Boolean);

  const singers = await Singer.find({
    _id: { $in: singerIds },
    deleted: false,
  })
    .select("fullName")
    .lean();

  const topics = await Topic.find({
    _id: { $in: topicIds },
    deleted: false,
  })
    .select("title")
    .lean();

  const singerMap = new Map(singers.map((item) => [item._id.toString(), item.fullName]));
  const topicMap = new Map(topics.map((item) => [item._id.toString(), item.title]));

  const songsFinal = songs.map((item) => ({
    ...item,
    singerName: item.singerId ? singerMap.get(item.singerId) || "Dang cap nhat" : "Dang cap nhat",
    topicName: item.topicId ? topicMap.get(item.topicId) || "Dang cap nhat" : "Dang cap nhat",
  }));

  res.render("admin/pages/song/index.pug", {
    pageTitle: "Quan ly bai hat",
    songs: songsFinal,
  });
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  })
    .sort({ title: 1 })
    .lean();

  const singers = await Singer.find({
    deleted: false,
  })
    .sort({ fullName: 1 })
    .lean();

  res.render("admin/pages/song/create.pug", {
    pageTitle: "Them moi bai hat",
    topics,
    singers,
  });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  const title = (req.body.title || "").trim();
  const avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
  const audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;

  // Ở thời điểm này req.body.avatar và req.body.audio
  // không còn là file nữa mà đã là URL Cloudinary do middleware gắn vào.
  const record = new Song({
    title,
    avatar: (avatar || "").trim(),
    description: (req.body.description || "").trim(),
    singerId: req.body.singerId || "",
    topicId: req.body.topicId || "",
    like: Number(req.body.like || 0),
    lyrics: (req.body.lyrics || "").trim(),
    audio: (audio || "").trim(),
    status: req.body.status || "active",
    slug: convertToSlug(title),
    listen: Number(req.body.listen || 0),
  });

  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/songs`);
};

// [GET] /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
  const song = await Song.findOne({
    _id: req.params.id,
    deleted: false,
  }).lean();

  if (!song) {
    return res.redirect(`${systemConfig.prefixAdmin}/songs`);
  }

  const topics = await Topic.find({
    deleted: false,
  })
    .sort({ title: 1 })
    .lean();

  const singers = await Singer.find({
    deleted: false,
  })
    .sort({ fullName: 1 })
    .lean();

  res.render("admin/pages/song/edit.pug", {
    pageTitle: "Chinh sua bai hat",
    song: {
      ...song,
      lyrics: normalizeLyrics(song.lyrics || ""),
    },
    topics,
    singers,
  });
};

// [POST] /admin/songs/edit/:id
export const editPost = async (req: Request, res: Response) => {
  const title = (req.body.title || "").trim();
  const avatar = Array.isArray(req.body.avatar) ? req.body.avatar[0] : req.body.avatar;
  const audio = Array.isArray(req.body.audio) ? req.body.audio[0] : req.body.audio;

  await Song.updateOne(
    {
      _id: req.params.id,
      deleted: false,
    },
    {
      title,
      // Chỉ cập nhật avatar khi người dùng upload file mới.
      ...(avatar ? { avatar: (avatar || "").trim() } : {}),
      description: (req.body.description || "").trim(),
      singerId: req.body.singerId || "",
      topicId: req.body.topicId || "",
      like: Number(req.body.like || 0),
      lyrics: (req.body.lyrics || "").trim(),
      // Audio cũng tương tự: không có file mới thì giữ link cũ.
      ...(audio ? { audio: (audio || "").trim() } : {}),
      status: req.body.status || "inactive",
      slug: convertToSlug(title),
      listen: Number(req.body.listen || 0),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/songs`);
};

// [POST] /admin/songs/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  await Song.updateOne(
    {
      _id: req.params.id,
    },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/songs`);
};
