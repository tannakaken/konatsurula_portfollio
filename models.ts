export const truncateMonth = (iSO8601String: string | undefined) => {
  if (iSO8601String === undefined) {
    return "";
  }
  const date = new Date(iSO8601String);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

export type WorkWithoutVideo = {
  id: string;
  title: string;
  description: string;
  publishedMonth: string;
  isSkeb?: boolean;
};

export type Work = WorkWithoutVideo & {
  youtubeId?: string;
  gifImage?: ImageData;
};

export type News = {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
};

export type ImageData = {
  url: string;
  height: number;
  width: number;
};

export type Illustration = {
  id: string;
  title: string;
  image: ImageData;
  is3d?: boolean;
};
