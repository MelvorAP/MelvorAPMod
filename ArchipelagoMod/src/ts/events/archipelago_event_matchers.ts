import { ItemType } from "../data/items";
import { ArchipelagoItemReceivedEvent, CombatAreaUnlockedEvent, SkillItemReceivedEvent } from "./archipelago_events";

export const ApItemReceivedType = "ApItemReceived";
export const ApSkillItemReceivedType = "ApSkillItemReceived";
export const ApPetReceivedType = "ApPetReceived";
export const ApCombatAreaUnlockType = "ApCombatAreaUnlock";

//@ts-ignore
export class ArchipelagoItemReceivedEventMatcher extends NonRaidGameEventMatcher {
    type: string;
    itemTypes = [] as ItemType[];

    constructor(options : any, game : Game, type : string = ApItemReceivedType) {
        super(game);
        this.type = options.callType ?? type;

        try {
            if (options.itemTypes !== undefined)
                this.itemTypes.push(...options.itemTypes);
        }
        catch (e) {
            //@ts-ignore
            throw new DataConstructionError(ArchipelagoItemReceivedEventMatcher.name, e);
        }
    }

    doesEventMatch(event : ArchipelagoItemReceivedEvent) {
        return this.itemTypes.includes(event.itemType);
    }

    _assignNonRaidHandler(handler : any) {
        //@ts-ignore
        this.game.itemHandler.on(this.type, handler);
    }

    _unassignNonRaidHandler(handler : any) {
        //@ts-ignore
        this.game.itemHandler.off(this.type, handler);
    }
}

export class ArchipelagoSkillItemReceivedEventMatcher extends ArchipelagoItemReceivedEventMatcher {
    skillId? : string;

    constructor(options : any, game : Game) {
        super(options, game, ApSkillItemReceivedType);

        try {
            if (options.skillId !== undefined)
                this.skillId = options.skillId;
        }
        catch (e) {
            //@ts-ignore
            throw new DataConstructionError(ArchipelagoSkillItemReceivedEventMatcher.name, e);
        }
    }
    doesEventMatch(event : SkillItemReceivedEvent) {
        return this.skillId == event.skillId;
    }
}