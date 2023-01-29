import System from "./System";
import { World as EcsEngine, Archetype } from "miniplex";
import { Entity, EntityFactory, MatchEntity, RoundEntity } from "../entities";
import { LevelContainer } from "../../parseLevel";
import Player, { opposite } from "../../Player";

export class MatchSystem extends System {
    private _entityFactory: EntityFactory;
    private _level: LevelContainer;
    private _archetypes: {
        match: Archetype<MatchEntity>;
        round: Archetype<RoundEntity>;
    };

    constructor(ecs: EcsEngine<Entity>, entityFactory: EntityFactory, level: LevelContainer) {
        super(ecs);

        this._entityFactory = entityFactory;
        this._level = level;
        this._archetypes = {
            match: ecs.archetype("match") as Archetype<MatchEntity>,
            round: ecs.archetype("round") as Archetype<RoundEntity>,
        };
    }

    init() {
        this._archetypes.match.onEntityAdded.add((entity) => {
            const firstPlayerToServe = Math.random() < 0.5 ? Player.ONE : Player.TWO;

            this._entityFactory.createRoundEntity(entity.id, firstPlayerToServe);
        });

        this._archetypes.round.onEntityRemoved.add((roundEntity) => {
            const matchEntity = this._lookupMatchEntity(roundEntity);

            if (matchEntity) {
                const { match } = matchEntity;
                const score = composeNewScore(matchEntity, roundEntity);
                const leadingPlayer = getLeadingPlayer(score);
                const leadingNumberOfPoints = score[leadingPlayer];

                match.score = score;
                console.log(score);
                if (leadingNumberOfPoints >= match.numberOfPointsToWin) {
                    match.wonByPlayer = leadingPlayer;
                    console.log(`Player "${leadingPlayer}" won with score ${Object.values(score).join(" / ")}`);
                } else {
                    this._entityFactory.createRoundEntity(matchEntity.id, opposite(roundEntity.round.servedByPlayer));
                }
            }
        });
    }

    _lookupMatchEntity({ round }: RoundEntity): MatchEntity | undefined {
        return this._archetypes.match.entities.find((entity) => entity.id === round.matchId);
    }
}

function getLeadingPlayer(score: MatchEntity["match"]["score"]): Player {
    const entries = Object.entries(score);
    return entries.reduce(
        (leadingEntry, entry) => (entry[1] > leadingEntry[1] ? entry : leadingEntry),
        entries[0],
    )[0] as Player;
}

function composeNewScore({ match }: MatchEntity, { round }: RoundEntity) {
    const score = { ...match.score };

    if (round.lostByPlayer) {
        score[opposite(round.lostByPlayer)] += 1;
    }

    return score;
}

export default MatchSystem;
