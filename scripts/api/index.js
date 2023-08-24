/**
 * @typedef {Object} PhotographerAPI
 * @property {string} name
 * @property {number} id
 * @property {string} city
 * @property {string} country
 * @property {string} tagline
 * @property {number} price
 * @property {string} portrait
 */

/**
 * @typedef {Object} IPhotographer
 * @property {number} id
 * @property {string} name
 * @property {string} picture
 * @property {string} city
 * @property {string} country
 * @property {string} tagline
 * @property {number} price
 */

/**
 * @typedef {Object} MediaAPI
 * @property {number} id
 * @property {number} photographerId
 * @property {string} title
 * @property {string} image
 * @property {string} video
 * @property {number} likes
 * @property {string} date
 * @property {number} price
 */

/**
 * @typedef {Object} IMedia
 * @property {number} id
 * @property {number} photographerId
 * @property {"IMAGE" | "VIDEO"} type
 * @property {string} title
 * @property {string} url
 * @property {number} likes
 * @property {string} date
 * @property {number} price
 */


import {photographerFactory, mediaFactory} from "../factories/photographer.js";

/** @type {Map<number, PhotographerAPI>} */
const Photographers = new Map();

/** @type {Map<number, MediaAPI>} */
const Medias = new Map();

let isInit = false;

function fetchApiData() {
  return fetch("/data/photographers.json")
    .then((response) => response.json());
}

async function init() {
  if (isInit) return;


  try {
    const {photographers, media} = await fetchApiData();

    photographers.forEach((photographer) => {
      Photographers.set(photographer.id, photographer);
    });

    media.forEach((media) => {
      Medias.set(media.id, media);
    });
    isInit = true;
  } catch (error) {
    console.error(error);
    isInit = false;
  }
}


/**
 * get photographer by id
 * @param {string | number} id
 * @return {IPhotographer | undefined}
 */
async function getPhotographerById(id) {
  await init();
  const data = Photographers.get(id);
  if (data) {
    return photographerFactory(data);
  }
  return undefined;
}

/**
 * get all photographers
 * @return {Promise<IPhotographer[]>}
 */
async function getPhotographers() {
  await init();
  return Array.from(Photographers.values())
    .map((photographer) => photographerFactory(photographer));
}

/**
 *  get media by id
 * @param {string | number} id
 * @return {MediaType | undefined}
 */
async function getMediaById(id) {
  await init();
  return Medias.get(id);
}

/**
 * get all medias
 * @return {Promise<Medias[]>}
 */
async function getMedias() {
  await init();
  return Array.from(Medias.values());
}

/**
 * get all medias by photographer id
 * @param {number} photographerId
 * @return {Promise<IMedia[]>}
 */
async function getMediasByPhotographerId(photographerId) {
  await init();
  return Array.from(Medias.values()).filter((media) => media.photographerId === photographerId)
    .map((media) => mediaFactory(media));
}

/**
 *
 * @param {number} id
 * @return {Promise<number>}
 */
async function getPhotographerLikes(id) {
  const medias = await getMediasByPhotographerId(id);
  return medias.reduce((acc, media) => acc + media.likes, 0);
}

export {
  getPhotographers,
  getMedias,
  getPhotographerById,
  getMediaById,
  getMediasByPhotographerId,
  getPhotographerLikes,
};

// Path: scripts/api/index.js
