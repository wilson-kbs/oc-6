import { render } from "./utils/html.js";
import { HomePage } from "./pages/home.js";
import { PhotographerPage } from "./pages/photographer.js";
import { NotFoundPage } from "./pages/404.js";
async function bootstrap() {
  const url = new URL(window.location.href);
  const location = url.pathname.split("/").pop();

  let page = null;

  switch (location) {
    case "index.html":
    case "":
      // render home page
      page = await HomePage()
      break;
    case "photographer.html":
      // render photographer page
      page = await PhotographerPage()
      break;
    default:
      // render 404 page
      page = await NotFoundPage()
      break;
  }

  render(document.querySelector("#main"), page);
}

void bootstrap();
