import { ItemType } from "../data/items";
import { SkillItemReceivedEvent } from "./archipelago_events";

export const ApItemReceivedType = "ApItemReceived";
export const ApSkillItemReceivedType = "ApSkillItemReceived";
export const ApPetReceivedType = "ApPetReceived";
export const ApCOmbatAreaUnlockType = "ApCOmbatAreaUnlock";

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

    }
    _unassignNonRaidHandler(handler : any) {

    }
}

export class ArchipelagoSkillItemReceivedEventMatcher extends ArchipelagoItemReceivedEventMatcher {
    type: string;
    skillId? : string;

    constructor(options : any, game : Game) {
        super(options, game);
        this.type = 'ArchipelagoSkillItemReceived';

        try {
            if (options.itemType !== undefined)
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
    _assignNonRaidHandler(handler : any) {
        //@ts-ignore
        this.game.skillHandler.getSkillHandler(this.skillId).on(this.type, handler);
    }
    _unassignNonRaidHandler(handler : any) {
        //@ts-ignore
        this.game.skillHandler.getSkillHandler(this.skillId).off(this.type, handler);
    }
}