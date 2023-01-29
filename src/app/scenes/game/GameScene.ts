import { Assets } from "@pixi/assets";
import { Viewport } from "pixi-viewport";
import Scene, { FacadeRefs } from "../../core/sceneManagement/Scene";
import TiledMap from "tiled-types";
import Game, { Event as GameEvent } from "./Game";
import GuiUnderlay from "./gui/underlay/GuiUnderlay";
import GuiOverlay from "./gui/overlay/GuiOverlay";
import { Container } from "pixi.js";

const LEVEL_DATA_PATH = "assets/levels/main.tiled.json";

export default class GameScene extends Scene {
    private _game: Game | null;
    private _gui: {
        underlay: GuiUnderlay | null;
        overlay: GuiOverlay | null;
    };
    private _viewport: Viewport;

    constructor(refs: FacadeRefs) {
        super(refs);

        this._game = null;
        this._gui = { underlay: null, overlay: null };
        this._viewport = this.addChild(
            new Viewport({
                screenWidth: this.renderer.width,
                screenHeight: this.renderer.height,
                worldWidth: 1024,
                worldHeight: 768,
            }),
        );
    }

    public async load(): Promise<void> {
        await Assets.load(LEVEL_DATA_PATH);
    }

    public init(): void {
        this._game = this._createGame(Assets.cache.get(LEVEL_DATA_PATH));

        this._gui.underlay = this._createGuiUnderlay();
        this._gui.overlay = this._createGuiOverlay();

        this._initLayout(this._game, this._viewport, this._gui);

        this._game.start();
    }

    public resize(width: number, height: number): void {
        this._viewport.resize(width, height);
        this._viewport.fit();
        this._viewport.moveCenter(this._viewport.worldWidth * 0.5, this._viewport.worldHeight * 0.5);

        if (this._gui.underlay) {
            this._gui.underlay.scale.copyFrom(this._viewport.scale);
            this._gui.underlay.position.copyFrom(this._viewport.position);
        }
    }

    public update(timeSinceLastFrameInS: number): void {
        this._game?.update(timeSinceLastFrameInS);
    }

    private _createGame(levelData: TiledMap): Game {
        const game = new Game(levelData);

        game.events.on(GameEvent.ROUND_START, () => console.log(GameEvent.ROUND_START));
        game.events.on(GameEvent.ROUND_END, () => this._gui.underlay?.updateScore(game.score));
        game.events.on(GameEvent.MATCH_END, () => console.log(GameEvent.MATCH_END));

        return game;
    }

    private _createGuiUnderlay(): GuiUnderlay {
        return this.addChildAt(new GuiUnderlay(), 0);
    }

    private _createGuiOverlay(): GuiOverlay {
        return this.addChild(new GuiOverlay());
    }

    private _initLayout({ level }: Game, viewport: Viewport, { underlay, overlay }: GameScene["_gui"]): void {
        const { width: worldWidth, height: worldHeight } = level.staticBounds;

        viewport.resize(undefined, undefined, worldWidth, worldHeight);
        viewport.addChild(level);

        underlay?.resize(worldWidth, worldHeight);
    }
}
