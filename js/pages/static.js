// Text pages (How to play, About, Privacy, 404) only need the layout.
// Their English and Dutch text is in the HTML; CSS shows the right one.
import { initPage } from "../ui/layout.js";

initPage(document.body.dataset.page || null);
