import he from "he";

export const normalizeLyrics = (value: string = ""): string => {
  if (!value) {
    return "";
  }

  return he
    .decode(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
