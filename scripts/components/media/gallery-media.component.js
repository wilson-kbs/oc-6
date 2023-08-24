import {h, render} from "../../utils/html.js";
import MediaComponent from "./media.component.js";
import {getStore} from "../../utils/store.js";

export class GalleryMediaComponent {
  _options = {
    onMediaClick: undefined,
    sortBy: "POPULARITY",
  }
  _galleryEl;
  _galleryContainerEl;

  _photographer;
  _medias;
  _toolsBarEl;
  _mediaComponentMap;

  constructor(photographer, medias, options = {}) {
    this._options = Object.assign({}, this._options, options);
    this._photographer = photographer;
    this._medias = medias;

    this._mediaComponentMap = new Map(medias.map(media => (
      [
        Number(media.id),
        new MediaComponent(
          media,
          {
            onClick: (event, id) => this._options?.onMediaClick?.(event, id),
            onLikes: (event, id) => this._updateGlobalDataElement(),
            onDislikes: (event, id) => this._updateGlobalDataElement(),
          }
        )
      ]
    )));

    this._galleryEl = h('section', { className: "gallery-media" });
    this._toolsBarEl = h('div', { className: "gallery-media__tools" }, [this._sortMediaByElement()]);
    this._galleryContainerEl = h('div', { className: "gallery-media__container" });

    render(this._galleryEl, this._toolsBarEl, this._galleryContainerEl, this._globalDataElement());
  }

  getMedia(id) {
    return this._mediaComponentMap.get(Number(id));
  }

  render() {
    this.update();
    return this._galleryEl;
  }

  update() {
    render(this._galleryContainerEl, ...this._sortMediasBy().map(media => media.render()));
  }

  _sortMediasBy(sortBy = this._options.sortBy) {
    const mediaComponents = [...this._mediaComponentMap.values()];
    switch (sortBy) {
      case "POPULARITY":
        return mediaComponents.sort((a, b) => b.media.likes - a.media.likes);
      case "DATE":
        return mediaComponents.sort((a, b) => new Date(b.media.date).getTime() - new Date(a.media.date).getTime());
      case "TITLE":
        return mediaComponents.sort((a, b) => a.media.title.localeCompare(b.media.title));
      default:
        throw new Error(`Unknown sort by: ${sortBy}`);
    }
  }

  _sortMediaByElement() {
    return h("form", { className: "gallery-media__sort-by" }, [
      h('label', { className: "gallery-media__sort-by__label", htmlFor: "gallery-media__sort-by__select"}, "Trier par"),
      h(
        'select',
        {
          id: "gallery-media__sort-by__select",
          className: "gallery-media__sort-by__select",
          onChange: (event) => {
            this._options.sortBy = event.target.value;
            this.update();
          }
        },
        [
          h('option', { value: "POPULARITY" }, "Popularité"),
          h('option', { value: "DATE" }, "Date"),
          h('option', { value: "TITLE" }, "Titre"),
        ],
      ),
    ]);
  }

  _getAllLikes() {
    const likes = this._medias.reduce((acc, media) => acc + media.likes, 0);
    const store = getStore("likedMedias")
    const likedMedias = Object.entries(store).reduce((acc, [id, isLiked]) => {
      if (this._mediaComponentMap.has(Number(id)) && isLiked === true) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return likes + likedMedias;
  }

  /*
    * Build the global data element
    * @returns {HTMLElement}
   */
  _globalDataElement() {
    const likes = this._getAllLikes();
    const {price} = this._photographer;

    return h(
      "div",
      { className: "gallery-media__global-data" },
      [
        h('span', { className: "gallery-media__global-data__likes" }, [
          h('span', { className: "gallery-media__global-data__likes__count" }, `${likes}`),
          h('i', { className: "fa-solid fa-heart", "aria-label": "likes" }),
        ]),
        h('span', { className: "gallery-media__global-data__price" }, `${price}€ / jour`),
      ],
    );
  }

  _updateGlobalDataElement() {
    const likes = this._getAllLikes();
    const likesEl = this._galleryEl.querySelector(".gallery-media__global-data__likes__count");
    likesEl.textContent = `${likes}`;
  }
}

export default GalleryMediaComponent;
