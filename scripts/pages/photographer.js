import {getMediasByPhotographerId, getPhotographerById} from "../api/index.js";
import {lightBoxFactory} from "../components/light-box.component.js";
import NotFoundPage from "./404.js";
import GalleryMediaComponent from "../components/media/gallery-media.component.js";
import {PhotographerComponent} from "../components/photographer.component.js";

export async function PhotographerPage() {
  const url = new URL(location.href);
  const photographerId = Number(url.searchParams.get("id"));
  const mediaId = Number(url.searchParams.get("media"));
  if (isNaN(photographerId)) return NotFoundPage();

  const photographer = await getPhotographerById(photographerId);
  if (!photographer) return NotFoundPage();

  const medias = await getMediasByPhotographerId(photographerId);
  const lightBox = lightBoxFactory(medias);

  const photographerComponent = new PhotographerComponent(photographer);

  const galleryMedia = new GalleryMediaComponent(photographer, medias, {
    onMediaClick: (event, id) => {
      lightBox.open(id);
    }
  })

  if (!isNaN(mediaId) && mediaId > 0) {
    setTimeout(() => {
      lightBox.open(mediaId);
    });
  }

  return [
    photographerComponent.headerDOM(),
    galleryMedia.render(),
  ];
}


