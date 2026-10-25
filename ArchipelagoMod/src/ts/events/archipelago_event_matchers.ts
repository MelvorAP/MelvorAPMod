import { ItemType } from "../data/items";
import { SkillItemReceivedEvent } from "./archipelago_events";

export const ApItemReceivedType = "ApItemReceived";
export const ApSkillItemReceivedType = "ApSkillItemReceived";
export const ApPetReceivedType = "ApPetReceived";
export const ApCombatAreaUnlockType = "ApCombatAreaUnlock";

//@ts-ignore
export class ArchipelagoItemReceivedEventMatcher extends NonRaidGameEventMatcher {
    type: string;
    itemType? : ItemType;

    constructor(options : any, game : Game) {
        super(game);
        this.type = ApItemReceivedType;

        try {
            if (options.itemType !== undefined)
                this.itemType = options.itemType;
        }
        catch (e) {
            //@ts-ignore
            throw new DataConstructionError(ArchipelagoItemReceivedEventMatcher.name, e);
        }
    }

    doesEventMatch(event : SkillItemReceivedEvent) {
        return this.itemType == event.itemType;
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
    type: string;
    skillId? : string;

    constructor(options : any, game : Game) {
        super(options, game);
        this.type = ApSkillItemReceivedType;

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