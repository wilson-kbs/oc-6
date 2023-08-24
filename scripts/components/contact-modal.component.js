import {h, render} from '../utils/html.js';
/**
 * Contact modal component
 * @class
 * @param {IPhotographer} photographer
 */
export class ContactModalComponent {
  /** @type {IPhotographer} */
  #photographer;

  /**
   * @constructor
   * @param {IPhotographer} photographer
   */
  constructor(photographer) {
    this.#photographer = photographer;
  }

  open() {
    this.#openModal();
  }

  close() {
    this.#closeModal();
  }

  #openModal() {
    const modal = document.getElementById("contact-modal__container")
    if (modal) {
      modal.classList.add("show");
    } else {
      const modals = document.getElementById("modals")
      const modal = this.#buildModal();
      modals.appendChild(modal);
    }
    window.addEventListener("keydown", this.#keyDownListener.bind(this), { once: true });
  }

  #closeModal() {
    const modal = document.getElementById("contact-modal__container")
    if (modal) {
      modal.classList.remove("show");
    }
    window.removeEventListener("keydown", this.#keyDownListener.bind(this));
  }

  #buildModal() {
    const modal = h(
      'div',
      { id: "contact-modal" },
      [
        this.#buildHeader(),
        this.#buildForm(),
      ],
    );
    return h("div", { id: "contact-modal__container", className: "show"}, [modal]);
  }

  #buildHeader() {
    const {name} = this.#photographer;
    return h(
      'header',
      { className: "contact-modal__header" },
      [
        h(
          'h2',
          { className: "contact-modal__title" },
          [`Contactez-moi`, h("br"),`${name}`],
        ),
        h(
          'button',
          {
            className: "contact-modal__close-button",
            onClick: (event) => this.#closeModal(),
          },
        ),
      ],
    );
  }

  #buildForm() {
    const firstName = h(
      'div',
      { className: "contact-modal__form__item" },
      [
        h('label', { htmlFor: "firstname" }, "Prénom"),
        h('input', { type: "text", id: "firstname", name: "firstname", required: true }),
      ]
    );

    const lastName = h(
      'div',
      { className: "contact-modal__form__item" },
      [
        h('label', { htmlFor: "lastname" }, "Nom"),
        h('input', { type: "text", id: "lastname", name: "lastname", required: true }),
      ]
    );

    const email = h(
      'div',
      { className: "contact-modal__form__item" },
      [
        h('label', { htmlFor: "email" }, "Email"),
        h('input', { type: "text", id: "email", name: "email", required: true }),
      ]
    );

    const message = h(
      'div',
      { className: "contact-modal__form__item" },
      [
        h('label', { htmlFor: "form-message" }, "Message"),
        h('textarea', { type: "text", id: "form-message", name: "message", required: true }),
      ]
    );
    return h(
      'form',
      {
        className: "contact-modal__form",
        onSubmit: (event) => this.#submitForm(event)
      },
      [
        firstName,
        lastName,
        email,
        message,
        h(
          "button",
          { className: "contact_button contact-modal__form__button" },
          "Envoyer",
        ),
      ],
    );
  }

  #submitForm(event) {
    event.preventDefault();

    // form validation
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const firstname = data.firstname
    const lastname = data.lastname;
    const email = data.email;
    const message = data.message;
    const errors = [];

    if (!firstname) {
      errors.push("Le prénom est obligatoire");
    }
    if (!lastname) {
      errors.push("Le nom est obligatoire");
    }
    if (!email) {
      errors.push("L'email est obligatoire");
    }
    if (!message) {
      errors.push("Le message est obligatoire");
    }
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    this.#closeModal();
    // reset form
    form.reset();
  }

  #keyDownListener(event) {
    if (event.key === "Escape") {
      this.#closeModal();
    }
  }
}
