import {h} from "../utils/html.js";

export function NotFoundPage() {
  const title = h('h1', {}, '404 - Page Not Found')
  const message = h('p', {}, 'Sorry, that page doesn\'t exist')

  return h(
    'div',
    {className: "not-found"},
    [title, message],
  );
}

export default NotFoundPage;
