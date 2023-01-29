import System from "./System";
import { World as EcsEngine, Archetype, RegisteredEntity } from "miniplex";
import { Entity, EntityFactory, MatchEntity, RoundEntity } from "../entities";
import { LevelContainer } from "../../utils/parseLevel";
import Player from "../../Player";

export class MatchSystem extends System {
    public entity: RegisteredEntity<MatchEntity>;

    private _entityFactory: EntityFactory;
    private _level: LevelContainer;
    private _archetype: Archetype<RoundEntity>;

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory, level: LevelContainer) {
        super(ecs);

        this.entity = entityFactory.createMatchEntity();

        this._entityFactory = entityFactory;
        this._level = level;
        this._archetype = ecs.archetype("round") as Archetype<RoundEntity>;
    }

    init() {
        this._archetype.onEntityRemoved.add(({ round }) => {
            this.entity.match.score[round.wonByPlayer!] += 1;
        });
    }

    update() {
        if (this._archetype.entities.length === 0) {
            if (checkPlayerWin(this.entity)) {
                console.log("WON");
            } else {
                const firstPlayerToServe = Math.random() < 0.5 ? Player.ONE : Player.TWO;
                this._entityFactory.createRoundEntity(firstPlayerToServe);
            }
        }
    }
}

function checkPlayerWin({ match }: MatchEntity): boolean {
    const pointsPerPlayer = Object.values(match.score);
    const leadingPoints = Math.max(...pointsPerPlayer);
    const followingPoints = Math.min(...pointsPerPlayer);
    const pointsDifference = leadingPoints - followingPoints;

    return leadingPoints >= match.numberOfPointsToWin && pointsDifference >= 2;
}

export default MatchSystem;
