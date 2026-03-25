import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import { convertToSlug } from "../../helpers/convertSlug";
import Singer from "../../models/singer.model";

// [GET] /admin/singers
export const index = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
  })
    .sort({ createdAt: -1 })
    .lean();

  res.render("admin/pages/singer/index.pug", {
    pageTitle: "Quan ly ca si",
    singers,
  });
};

// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singer/create.pug", {
    pageTitle: "Them moi ca si",
  });
};

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  const fullName = (req.body.fullName || "").trim();

  const record = new Singer({
    fullName,
    avatar: (req.body.avatar || "").trim(),
    description: (req.body.description || "").trim(),
    status: req.body.status || "active",
    slug: convertToSlug(fullName),
  });

  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/singers`);
};

// [GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
  const singer = await Singer.findOne({
    _id: req.params.id,
    deleted: false,
  }).lean();

  if (!singer) {
    return res.redirect(`${systemConfig.prefixAdmin}/singers`);
  }

  res.render("admin/pages/singer/edit.pug", {
    pageTitle: "Chinh sua ca si",
    singer,
  });
};

// [POST] /admin/singers/edit/:id
export const editPost = async (req: Request, res: Response) => {
  const fullName = (req.body.fullName || "").trim();

  await Singer.updateOne(
    {
      _id: req.params.id,
      deleted: false,
    },
    {
      fullName,
      avatar: (req.body.avatar || "").trim(),
      description: (req.body.description || "").trim(),
      status: req.body.status || "inactive",
      slug: convertToSlug(fullName),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/singers`);
};

// [POST] /admin/singers/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  await Singer.updateOne(
    {
      _id: req.params.id,
    },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  res.redirect(`${systemConfig.prefixAdmin}/singers`);
};
