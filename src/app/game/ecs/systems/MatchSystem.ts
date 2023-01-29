import System from "./System";
import { World as EcsEngine, Archetype, RegisteredEntity } from "miniplex";
import { Entity, EntityFactory, MatchEntity, RoundEntity } from "../entities";
import { Event } from "../../Event";
import Player from "../../Player";
import { utils } from "pixi.js";

export class MatchSystem extends System {
    public entity: RegisteredEntity<MatchEntity>;

    private _entityFactory: EntityFactory;
    private _eventBus: utils.EventEmitter;
    private _archetype: Archetype<RoundEntity>;

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory, eventBus: utils.EventEmitter) {
        super(ecs);

        this.entity = entityFactory.createMatchEntity();

        this._entityFactory = entityFactory;
        this._eventBus = eventBus;
        this._archetype = ecs.archetype("round") as Archetype<RoundEntity>;
    }

    init() {
        this._archetype.onEntityRemoved.add(({ round }) => {
            this.entity.match.score[round.wonByPlayer!] += 1;

            this._eventBus.emit(Event.ROUND_END);
        });
    }

    update() {
        if (this._archetype.entities.length === 0) {
            if (checkPlayerWin(this.entity)) {
                this._eventBus.emit(Event.MATCH_END);
            } else {
                const firstPlayerToServe = Math.random() < 0.5 ? Player.ONE : Player.TWO;

                this._entityFactory.createRoundEntity(firstPlayerToServe);
                this._eventBus.emit(Event.ROUND_START);
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
