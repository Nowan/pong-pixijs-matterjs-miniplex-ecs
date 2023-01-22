import { utils, Container, IRenderer } from "pixi.js";
import App from "../../App";
import Scene from "./Scene";

export enum Event {
    SCENE_INITIALIZED = "sceneDirector:sceneInitialized",
}

type SceneAlias = string;
type SceneConstructor = typeof Scene;

export default class SceneDirector extends utils.EventEmitter<Event> {
    private _stage: Container;
    private _renderer: IRenderer;
    private _sceneConstructors: Map<SceneAlias, SceneConstructor>;
    private _activeScene: Scene | null;

    constructor(app: App) {
        super();

        this._stage = app.stage;
        this._renderer = app.renderer;
        this._sceneConstructors = new Map();
        this._activeScene = null;
    }

    public register(alias: SceneAlias, Scene: SceneConstructor): void {
        this._sceneConstructors.set(alias, Scene);
    }

    public goTo(alias: SceneAlias, ...args: Array<any>): void {
        const Scene = this._sceneConstructors.get(alias);

        if (Scene) {
            const scene = new Scene({ director: this, renderer: this._renderer });

            if (this._activeScene) {
                this._activeScene.ticker.stop();
                this._activeScene.destroy();
                this._stage.removeChild(this._activeScene);
            }

            scene.load().then(() => {
                scene.init(...args);

                if (scene.update) {
                    let elapsedTimeInS = 0;

                    scene.ticker.add((deltaTimeInMs) => {
                        const deltaTimeInS = deltaTimeInMs * 0.01;
                        elapsedTimeInS += deltaTimeInS;
                        scene.update?.(deltaTimeInS, elapsedTimeInS);
                    });

                    scene.ticker.start();
                }
            });

            this._stage.addChild(scene);
            this._activeScene = scene;
        } else {
            console.error('Scene alias "' + alias + '" is not registered.');
        }
    }

    resize(width: number, height: number) {
        this._activeScene?.resize(width, height);
    }
}