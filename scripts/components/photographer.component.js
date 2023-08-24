import {h} from "../utils/html.js";
import {ContactModalComponent} from "./contact-modal.component.js";

export class PhotographerComponent {
  /** @type {IPhotographer} */
  #photographer;

  /** @type {ContactModalComponent} */
  contactModal;

  /**
   * @constructor
   * @param {IPhotographer} photographer
   */
  constructor(photographer) {
    this.#photographer = photographer;
    this.contactModal = new ContactModalComponent(photographer);
  }

  cardDOM() {
    const {
      id,
      name,
      city,
      country,
      tagline,
      price,
    } = this.#photographer;

    const elName = h('h2', { className: "photographer-card__name" }, name);
    const elLocation = h('span', { className: "info__location" }, `${city}, ${country}`);
    const elTagline = h('span', { className: "info__tagline" }, tagline);
    const elPrice = h('span', { className: "info__price" }, `${price}€/jour`);


    return h(
      'article',
      { className: "photographer-card" },
      [
        h("header", { className: "photographer-card__header" }, [
          h(
            'a',
            {
              className: "photographer-card__link",
              href: `/photographer.html?id=${id}`,
            },
            [
              this.pictureDOM(),
              elName,
            ],
          ),

          ]),
        h(
          'div',
          { className: "photographer-card__info" },
          [elLocation, elTagline, elPrice]
        ),
      ]
    );
  }

  headerDOM() {
    const {
      id,
      name,
      city,
      country,
      tagline,
    } = this.#photographer;

    return h(
      'header',
      { className: "photographer-header"},
      [
        h(
          'div',
          { className: "photographer-header__info"},
          [
            h('h1', { className: "info-name" }, name),
            h('span', { className: "info-location" }, `${city}, ${country}`),
            h('span', { className: "info-tagline" }, tagline),
          ]
        ),
        h(
          'button',
          {
            className: "contact_button",
            onClick: (event) => this.contactModal.open(),
          },
          "Contactez-moi",
        ),
        this.pictureDOM(),
      ],
    );
  }

  pictureDOM() {
    return h(
      'div',
      { className: "photographer-picture" },
      h('img', { src: this.#photographer.picture, alt: `Photo de profile de ${this.#photographer.name}` }),
    );
  }
}
