import Player from "../../Player";

export interface DeadzoneComponentDataObject {
    triggered: boolean;
    keeper: Player;
}

export interface DeadzoneComponent {
    deadzone: DeadzoneComponentDataObject;
}

export default DeadzoneComponent;
