import { Container, Sprite, useApp } from "@pixi/react";
import { useAssetsBundle } from "../../hooks/useAssets";
import { useAppResize } from "../../hooks/useResize";

export default function MainScene() {
    const { assets, progress, errorMessage } = useAssetsBundle("mainScene");
    const { width, height } = useAppResize();

    return (
        <>
            {assets && (
                <Container>
                    <Sprite image="assets/textures/background.jpg" width={width} height={height} />
                    <Sprite image="assets/textures/cardsDeck/BackFace.png" />
                </Container>
            )}
        </>
    );
}
