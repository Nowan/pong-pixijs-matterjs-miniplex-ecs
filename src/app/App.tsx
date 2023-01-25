import { Stage } from "@pixi/react";
import MainScene from "./components/scenes/MainScene";
import { useAssetsManifest } from "./hooks/useAssets";

export interface Props {
    width: number;
    height: number;
}

export default function App(props: Props) {
    const isManifestLoaded = useAssetsManifest("assets/manifest.json");

    return (
        <Stage width={props.width} height={props.height}>
            {isManifestLoaded && <MainScene />}
        </Stage>
    );
}
