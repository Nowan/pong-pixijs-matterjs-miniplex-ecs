import { Container, Sprite } from "@pixi/react";
import { useAssetsBundle } from "../../hooks/useAssets";

export default function MainScene() {
    const { assets, progress, errorMessage } = useAssetsBundle("mainScene");

    return (
        <>
            {assets && (
                <Container>
                    <Sprite image="assets/textures/background.jpg" />
                    <Sprite image="assets/textures/cardsDeck/BackFace.png" />
                </Container>
            )}
        </>
    );
}
