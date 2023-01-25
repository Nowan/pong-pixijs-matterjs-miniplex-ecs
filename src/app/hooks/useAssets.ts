import { Assets, ProgressCallback } from "pixi.js";
import { useEffect, useState } from "react";

export type AssetsEffectState = {
    assets: null | Assets;
    progress: number;
    errorMessage: null | string;
};

export type Assets = Record<string, Asset>;

type Asset = any;

export function useAssets(this: any, ...assetsPaths: string[]): AssetsEffectState {
    return useAssetsLoader(loadAssets.bind(this, assetsPaths));
}

export function useAssetsBundle(this: any, ...assetsBundleIds: string[]): AssetsEffectState {
    return useAssetsLoader(loadAssetsBundle.bind(this, assetsBundleIds));
}

export function useAssetsManifest(manifestPath: string): boolean {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        Assets.init({ manifest: manifestPath }).then(() => setIsLoaded(true));
    }, []);

    return isLoaded;
}

function useAssetsLoader(assetsLoader: (onProgress: ProgressCallback) => Promise<Assets>): AssetsEffectState {
    const [assets, setAssets] = useState<AssetsEffectState["assets"]>(null);
    const [progress, setProgress] = useState<AssetsEffectState["progress"]>(0);
    const [errorMessage, setErrorMessage] = useState<AssetsEffectState["errorMessage"]>(null);

    useEffect(() => {
        assetsLoader((progress) => setProgress(progress))
            .then((assets) => setAssets(assets))
            .catch((errorMessage) => setErrorMessage(errorMessage));
    }, []);

    return { assets, progress, errorMessage };
}

async function loadAssets(assetsPaths: Array<string>, onProgress?: ProgressCallback): Promise<Assets> {
    assetsPaths.forEach((assetPath) => Assets.add(assetPath, assetPath));
    return Assets.load(assetsPaths, onProgress);
}

async function loadAssetsBundle(assetsBundleIds: string[], onProgress?: ProgressCallback): Promise<Assets> {
    return flattenBundleAssets(await Assets.loadBundle(assetsBundleIds, onProgress));
}

function flattenBundleAssets(bundleIdToAssetsMap: { [bundleId: string]: Assets }): Assets {
    const assets: Assets = {};

    for (let bundleAssets of Object.values(bundleIdToAssetsMap)) {
        for (let [assetPath, asset] of Object.entries(bundleAssets)) {
            if (assets[assetPath] === undefined) {
                assets[assetPath] = asset;
            } else {
                console.warn(`Asset "${assetPath}" shared between multiple bundles`);
            }
        }
    }

    return assets;
}

export default useAssets;
