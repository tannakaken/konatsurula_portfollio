export type Work = {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
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
  description: string;
};
