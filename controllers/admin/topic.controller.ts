import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import { convertToSlug } from "../../helpers/convertSlug";
import Topic from "../../models/topic.model";

// [GET] /admin/topics
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  res.render("admin/pages/topic/index.pug", {
    pageTitle: "Quan ly chu de",
    topics,
  });
};

// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/topic/create.pug", {
    pageTitle: "Them moi chu de",
  });
};

// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
  const title = (req.body.title || "").trim();

  const record = new Topic({
    title,
    avatar: (req.body.avatar || "").trim(),
    description: (req.body.description || "").trim(),
    status: req.body.status || "active",
    slug: convertToSlug(title),
  });

  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/topics`);
};

// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
    deleted: false,
  }).lean();

  if (!topic) {
    return res.redirect(`${systemConfig.prefixAdmin}/topics`);
  }

  res.render("admin/pages/topic/edit.pug", {
    pageTitle: "Chinh sua chu de",
    topic,
  });
};

// [POST] /admin/topics/edit/:id
export const editPost = async (req: Request, res: Response) => {
  const title = (req.body.title || "").trim();

  await Topic.updateOne(
    {
      _id: req.params.id,
      deleted: false,
    },
    {
      title,
      avatar: (req.body.avatar || "").trim(),
      description: (req.body.description || "").trim(),
      status: req.body.status || "inactive",
      slug: convertToSlug(title),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/topics`);
};

// [POST] /admin/topics/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  await Topic.updateOne(
    {
      _id: req.params.id,
    },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/topics`);
};
