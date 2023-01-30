import { utils, Container, AbstractRenderer } from "pixi.js";
import App from "../../App";
import Scene from "./Scene";

export enum Event {
    SCENE_INIT = "sceneDirector:sceneInit",
}

type SceneAlias = string;
type SceneConstructor = typeof Scene;

export default class SceneDirector extends utils.EventEmitter<Event> {
    private _app: App;
    private _sceneConstructors: Map<SceneAlias, SceneConstructor>;
    private _activeScene: Scene | null;

    constructor(app: App) {
        super();

        this._app = app;
        this._sceneConstructors = new Map();
        this._activeScene = null;

        app.renderer.on("resize", this._resizeActiveScene.bind(this));
    }

    public register(alias: SceneAlias, Scene: SceneConstructor): void {
        this._sceneConstructors.set(alias, Scene);
    }

    public goTo(alias: SceneAlias, ...args: Array<any>): void {
        const Scene = this._sceneConstructors.get(alias);

        if (Scene) {
            const scene = new Scene({ director: this, renderer: this._app.renderer });

            scene.load().then(() => {
                scene.init(...args);
                this._resizeScene(scene);

                if (scene.update) {
                    let elapsedTimeInS = 0;

                    scene.ticker.add((deltaTimeInMs) => {
                        const deltaTimeInS = deltaTimeInMs * 0.01;
                        elapsedTimeInS += deltaTimeInS;
                        scene.update?.(deltaTimeInS, elapsedTimeInS);
                    });

                    scene.ticker.start();
                }

                if (this._activeScene) {
                    this._activeScene.ticker.stop();
                    this._activeScene.destroy();
                    this._app.stage.removeChild(this._activeScene);
                }

                this._app.stage.addChild(scene);
                this._activeScene = scene;
            });
        } else {
            console.error(`Scene alias "${alias}" is not registered.`);
        }
    }

    private _resizeActiveScene(): void {
        if (this._activeScene) {
            this._resizeScene(this._activeScene);
        }
    }

    private _resizeScene(scene: Scene): void {
        scene.resize(this._app.renderer.width, this._app.renderer.height);
    }
}
