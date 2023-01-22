import { Loader, Sprite } from "pixi.js";
import App from "./modules/App";
import connectPixiDevTools from "../devscripts/connectPixiDevTools";

import "./index.css";

window.onload = async (event) => {
    const app = new App();

    mountGameCanvas(app, document.body);

    await loadGameAssets();

    const background = Sprite.from("assets/textures/background.jpg");
    background.anchor.set(0.5);
    app.viewport.addChild(background);

    const card = Sprite.from("assets/textures/cardsDeck/BackFace.png");
    card.anchor.set(0.5);
    card.scale.set(0.5);
    app.viewport.addChild(card);
};

function mountGameCanvas(app: App, rootDOM: HTMLElement) {
    rootDOM.appendChild(app.view);
    setUpResize(app);
}

function setUpResize(app: App) {
    resize(app);
    window.addEventListener("resize", () => resize(app));
}

function resize(app: App) {
    const targetWidth = window.innerWidth;
    const targetHeight = window.innerHeight;

    app.renderer.resize(targetWidth, targetHeight);
    app.viewport.resize(targetWidth, targetHeight);
    app.viewport.moveCenter(0, 0);
    app.viewport.fitWorld();
}

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = Loader.shared;

        loader.add("assets/textures/background.jpg", "assets/textures/background.jpg");
        loader.add("assents/textures/cardsDeck.json", "assets/textures/cardsDeck.json");

        loader.onComplete.once(() => res());
        loader.onError.once(() => rej());

        loader.load();
    });
}

connectPixiDevTools();
