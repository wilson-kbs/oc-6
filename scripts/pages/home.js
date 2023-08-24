import { getPhotographers } from "../api/index.js";
import {h} from "../utils/html.js";
import {PhotographerComponent} from "../components/photographer.component.js";
import splitArray from "../utils/slitArray.js";

export async function HomePage() {
    const photographers = await getPhotographers()
    return h(
      "div",
      { class: "photographers" },
      splitArray(photographers).map((photographers_container) => {
        return h(
          "div",
          { class: "photographers-row" },
          photographers_container.map((photographer) => {
            const photographerComponent = new PhotographerComponent(photographer);
            const userCardDOM = photographerComponent.cardDOM();
            return userCardDOM;
          })
        )
        }),
    );
}



