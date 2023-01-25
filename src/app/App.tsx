import { Stage } from "@pixi/react";
import MainScene from "./components/scenes/MainScene";
import { useAssetsManifest } from "./hooks/useAssets";

export default function App() {
    const isManifestLoaded = useAssetsManifest("assets/manifest.json");

    return <Stage>{isManifestLoaded && <MainScene />}</Stage>;
}
