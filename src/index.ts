import App from "./modules/App";
import connectPixiDevTools from "../devscripts/connectPixiDevTools";

import "./index.css";

window.onload = async (event) => {
    const app = new App();

    document.body.appendChild(app.view);

    setUpResize(app);
};

function setUpResize(app: App) {
    resize(app);
    window.addEventListener("resize", () => resize(app));
}

function resize(app: App) {
    const targetWidth = window.innerWidth;
    const targetHeight = window.innerHeight;

    app.renderer.resize(targetWidth, targetHeight);
}

connectPixiDevTools();
