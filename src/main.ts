import { SkyrimGradeApp } from "./skyrim-grade/app/App";

const appElementId = "app";
const appElement = document.getElementById(appElementId);

if (!appElement) {
  throw new Error(`Init App: Element with id ${appElementId} not found for`);
}

const app = new SkyrimGradeApp(appElement);
app.init({});
