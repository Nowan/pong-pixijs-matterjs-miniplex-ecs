import { IBodyDefinition } from "matter-js";

export default {
    ball: {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        inertia: Infinity,
    },
    borders: {
        friction: 0,
        frictionStatic: 0,
        restitution: 1,
        inertia: Infinity,
    },
    paddles: {
        friction: 0,
        frictionStatic: 0,
        restitution: 1,
        inertia: Infinity,
    },
} as Record<"ball" | "borders" | "paddles", IBodyDefinition>;
