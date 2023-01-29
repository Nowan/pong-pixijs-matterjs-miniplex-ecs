import { Container } from "pixi.js";
import PauseButton from "./elements/PauseButton";
import PauseMenuPopup from "./elements/PauseMenuPopup";
import GuiEvent from "../../events/GuiEvent";

export default class GuiOverlay extends Container {
    private _pauseButton: PauseButton = this._createPauseButton();
    private _pauseMenuPopup: PauseMenuPopup = this._createPauseMenuPopup();

    public showPausePopup() {
        this._pauseMenuPopup.show();
        this._pauseButton.disableInteractivity();
    }

    public hidePausePopup() {
        this._pauseMenuPopup.hide();
        this._pauseButton.enableInteractivity();
    }

    public resize(width: number, height: number): void {
        this._pauseButton.position.set(width - 50, 50);
        this._pauseMenuPopup.position.set(width * 0.5, height * 0.5);
    }

    private _createPauseButton(): PauseButton {
        const pauseButton = new PauseButton();
        pauseButton.on("pointerdown", () => this.emit(GuiEvent.PAUSE_BUTTON_CLICKED));
        return this.addChild(pauseButton);
    }

    private _createPauseMenuPopup(): PauseMenuPopup {
        const pauseMenuPopup = new PauseMenuPopup();
        pauseMenuPopup.on("pointerdown", () => this.emit(GuiEvent.CONTINUE_BUTTON_CLICKED));
        pauseMenuPopup.hide();
        return this.addChild(pauseMenuPopup);
    }
}
