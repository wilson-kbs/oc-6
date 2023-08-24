/**
 * @fileOverview Ligthbox component.
 */

/**
 * @typedef {Object} LigthboxParams
 * @property {HTMLElement} parent
 * @property {string} [description]
 * @property {string} [image]
 * @property {string} [video]
 * @property {string} [alt]
 * @property {string} [date]
 */

import {h} from "../utils/html.js";

/**
 * Ligthbox
 * @class
 * @param {Array<IMedia>} medias
 * @param {Object} params
 */
export class LightBoxComponent {

  #medias;
  #params;

  #container;
  #closeBtn;
  #nextBtn;
  #previousBtn;
  #content;

  #currentMediaId;

  #abortController;

  constructor(medias, params) {
    this.#medias = medias;
    this.#params = params;
    this.#closeBtn = h("button", { className: "lightbox__close" }, "X");
    this.#nextBtn = h("button", { className: "lightbox__next" });
    this.#previousBtn = h("button", { className: "lightbox__prev" });
    this.#content = h("div", { className: "lightbox__content" }, []);
    this.#abortController = new AbortController();
    this.addEvents();
  }

  set medias(medias) {
    this.#medias = medias;
  }

  addEvents() {
    this.#closeBtn.addEventListener("click", () => this.close());
    this.#nextBtn.addEventListener("click", () => this.next());
    this.#previousBtn.addEventListener("click", () => this.previous());
  }

  addKeyboardEvents() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
      if (event.key === "ArrowRight") {
        this.next();
      }
      if (event.key === "ArrowLeft") {
        this.previous();
      }
    }, { signal: this.#abortController.signal });
  }

  open(id) {
    document.body.style.overflow = "hidden";
    if (!this.#container) {
      this.#container = h(
        "div",
        { className: "lightbox" },
        [
          h("div", { className: "lightbox__left-side" }, [this.#previousBtn]),
          this.#content,
          h("div", { className: "lightbox__right-side" }, [
            this.#closeBtn,
            this.#nextBtn,
          ])
        ],
      );

      this.#params.parent.appendChild(this.#container);
    }

    this.#container.classList.add("lightbox--visible");
    this.addKeyboardEvents();
    if (id) this.setCurrentMedia(id)

    const currentUrl = new URL(window.location.href);
    if (!currentUrl.searchParams.has('media')) {
      currentUrl.searchParams.set('media', id);
      history.pushState(null, null, currentUrl.toString());
    }
  }

  close() {
    this.#container.classList.remove("lightbox--visible");
    this.#abortController.abort();
    this.#abortController = new AbortController();
    document.body.style.overflow = "auto";

    if (history.length > 1) {
      history.back();
    } else {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('media');
      history.replaceState(null, null, currentUrl.toString());
    }
  }

  /**
   * @description set current media
   * @param {number} id
   */
  setCurrentMedia(id) {
    const media = this.#medias.find((media) => media.id === id);
    if (!media) {
      throw new Error("Media not found");
    }
    this.#currentMediaId = id;
    this.#content.innerHTML = "";
    let mediaElement = this.#getMediaElement(media);
    if (!mediaElement) {
      mediaElement = h("div", { className: "lightbox__media lightbox__error" }, "Media not found");
    }
    this.#content.appendChild(mediaElement);
    if (media.type === "VIDEO") {
      mediaElement.focus();
    }
  }

  next() {
    const currentIndex = this.#medias.findIndex((media) => media.id === this.#currentMediaId);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.#medias.length) {
      nextIndex = 0;
    }
    this.setCurrentMedia(this.#medias[nextIndex].id);
  }

  previous() {
    const currentIndex = this.#medias.findIndex((media) => media.id === this.#currentMediaId);
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = this.#medias.length - 1;
    }
    this.setCurrentMedia(this.#medias[previousIndex].id);
  }

  /**
   * @param {IMedia} media
   * @return {HTMLElement}
   */
  #getMediaElement(media) {
    if (media.type === "IMAGE") {
      return h("img", {
        className: "lightbox__media lightbox__image",
        src: media.url,
        alt: media.title,
        loading: "lazy",
      });
    }
    if (media.type === "VIDEO") {
      const mediaElement = h("video", {
        className: "lightbox__media lightbox__video",
        controls: true,
        alt: media.title,
      },
        h("source", { src: media.url, type: "video/mp4" }),
      );
      mediaElement.autoplay = true;
      mediaElement.loop = true;
      mediaElement.muted = true;
      return mediaElement;
    }
  }
}

export function lightBoxFactory(medias, params  = { parent: document.body }) {
  if (!Array.isArray(medias)) {
    throw new Error("medias must be an array");
  }
  if (!medias.length) {
    throw new Error("medias must not be empty");
  }
  if (!params.parent) {
    throw new Error("params.parent must be defined");
  }
  return new LightBoxComponent(medias, params);
}
