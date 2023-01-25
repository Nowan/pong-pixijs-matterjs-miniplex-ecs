import { Container, Sprite, useApp } from "@pixi/react";
import { useAssetsBundle } from "../../hooks/useAssets";
import { useAppResize } from "../../hooks/useResize";

const FIELD_WIDTH = 1024;
const FIELD_HEIGHT = 768;

export default function MainScene() {
    const { assets, progress, errorMessage } = useAssetsBundle("mainScene");
    const { width, height } = useAppResize();
    const scale = Math.min(width / FIELD_WIDTH, height / FIELD_HEIGHT);

    return (
        <>
            {assets && (
                <Container
                    scale={scale}
                    x={width * 0.5}
                    y={height * 0.5}
                    pivot={{ x: FIELD_WIDTH * 0.5, y: FIELD_HEIGHT * 0.5 }}
                >
                    <Sprite image="assets/textures/background.jpg" />
                    <Sprite image="assets/textures/cardsDeck/BackFace.png" />
                </Container>
            )}
        </>
    );
}
