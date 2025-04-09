export const truncateMonth = (iSO8601String: string | undefined) => {
  if (iSO8601String === undefined) {
    return "";
  }
  const date = new Date(iSO8601String);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

/**
 * 動画がyoutubeで公開されていない仕事で関わった作品の情報
 */
export type WorkWithoutVideo = {
  id: string;
  title: string;
  description: string;
  publishedMonth?: string;
  isSkeb?: boolean;
};

/**
 * 仕事で関わった作品の情報
 */
export type Work = WorkWithoutVideo & {
  youtubeId?: string;
  gifImage?: ImageData;
};

/**
 * お知らせの情報
 */
export type News = {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
};

/**
 * 画像の情報
 */
export type ImageData = {
  url: string;
  height: number;
  width: number;
};

/**
 * 自主制作物の情報
 * 
 * - イラスト
 * - 3Dモデル
 * - youtube動画
 * - 映像
 */
export type MyWork = {
  id: string;
  title: string;
  /**
   * youtubeIDも独自動画のパスも設定されていなければ、必ず動画は設定すること。
   * これは、管理者の責務。
   */
  image?: ImageData;
  is3D?: boolean;
  /**
   * s3に保存した独自動画のパス
   */
  videoPath?: string;
  /**
   * youtube動画のID
   */
  youtubeId?: string;
  /**
   * youtube動画の説明文
   */
  description?: string;
};
