import * as path from "../utils/path.js";
import {MEDIAS_PATH, PHOTOGRAPHERS_PATH} from "../constants.js";

/**
 * @param {PhotographerAPI} data
 * @return {IPhotographer}
 */
export function photographerFactory(data) {
  const {portrait, ...rest} = data;
  return {
    ...rest,
    picture: path.join(PHOTOGRAPHERS_PATH, portrait),
  };
}

/**
 * @param {MediaAPI} data
 * @return {IMedia}
 */
export function mediaFactory(data) {
  const {image, video, ...rest} = data;

  return {
    ...rest,
    url: path.join(MEDIAS_PATH, data.photographerId, image ?? video),
    type: image ? "IMAGE" : "VIDEO",
  }
}

export default photographerFactory;
