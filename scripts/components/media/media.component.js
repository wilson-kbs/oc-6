import {h} from "../../utils/html.js";
import {getStore, getStoreItem, setStore} from "../../utils/store.js";
import {generateImagePreviewFromVideo} from "../../utils/media.util.js";

export class MediaComponent {

  _options = {
    onClick: undefined,
    onLikes: undefined,
    onDislikes: undefined,
  }

  _element;

  constructor(media, options = this._options) {
    this._media = media;
    this._options = options;
  }

  get media() {
    return this._media;
  }

  render() {
    if (this._element) return this._element;
    this._element = this._createMediaElement();
    return this._element;
  }

  _createMediaElement() {
    const {id, likes, title, photographerId} = this._media;
    const isLiked = this._isLiked();

    const mediaInfo = h(
      'div',
      { className: "media__info" },
      [
        h('h2', { className: "media__title" }, title),
        h(
          'span',
          {
            className: "media__likes",
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              const isLiked = this._toggleLikes();
              if (isLiked && typeof this._options.onLikes === "function") {
                this._options.onLikes(event, id);
              }

              if (!isLiked && typeof this._options.onDislikes === "function") {
                this._options.onDislikes(event, id);
              }
            },
          }, [
            h('span', { className: "likes-count" }, `${(likes || 0) + (isLiked ? 1 : 0)}`),
            h('button', { className: "likes-btn" }, [
              h('i', { className: "fa-solid fa-heart", "aria-label": "likes" }),
              h('span', { className: "visually-hidden" }, "likes"),
            ]),
          ]),
      ],
    );

    return h(
      'article',
      { className: "media" },
      [
        h(
          'a',
          {
            href: `/photographer.html?id=${photographerId}&media=${id}`,
            className: "media__link",
            onClick: (event) => {
              if (typeof this._options.onClick === "function") {
                event.preventDefault();
                this._options.onClick(event, id)
              }
            }},
          this._previewElement(),
        ),
        mediaInfo,
      ],
    );
  }

  _isLiked() {
    return getStoreItem("likedMedias", this._media.id) === true;
  }

  _toggleLikes() {
    const {id, likes: likesCount} = this._media;
    const likedMedias = getStore("likedMedias");
    if (likedMedias[id]) {
      delete likedMedias[id];
    } else {
      likedMedias[id] = true;
    }
    const isLiked = likedMedias[id] === true;

    const likesCountEl = this._element.querySelector(".likes-count");
    likesCountEl.textContent = `${likesCount + (isLiked ? 1 : 0)}`;

    setStore("likedMedias", { [id]: isLiked });

    return isLiked;
  }

  _previewElement() {
    const {type, title, url} = this._media;
    const mediaClass = "media__preview"

    if (type === 'IMAGE') {

      return h(
        'img',
        {
          className: mediaClass,
          src: url,
          alt: title,
        },
      );
    }

    if (type === 'VIDEO') {
      const img = new Image();

      generateImagePreviewFromVideo(url).then((blob) => {
        img.src = URL.createObjectURL(blob);
      });

      return h(
        img,
        {
          className: mediaClass,
          alt: title,
        },
      );
    }

    throw new Error(`Unknown media type: ${type}`);
  }
}

export default MediaComponent;
