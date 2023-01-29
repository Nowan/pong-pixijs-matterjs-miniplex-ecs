import Player from "../../Player";

export interface DeadzoneComponent {
    deadzone: {
        triggered: boolean;
        keeper: Player;
    };
}

export default DeadzoneComponent;
