import { SkillMult, ItemTypeMult, NamespaceMult, NamespaceEnum } from "../data/general";
import { Items } from "../data/items";
import { Locations, LocationType } from "../data/locations";
import { ConnectionHandler } from "./connection_handler";


//@ts-ignore
export class LocationHandler extends GameEventEmitter {
    public lastRecievedItemIndex : number = -1;

    public locations : Locations;

    private characterStorage : ModStorage;
    private connectionHandler : ConnectionHandler;

    constructor(locations : Locations, connectionHandler : ConnectionHandler){
        super();

        this.locations = locations;

        this.characterStorage = {} as ModStorage; 

        this.connectionHandler = connectionHandler;
    }

    public setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    public sendLocation(skillId : string, locationType : LocationType, namespace : Namespace, id : number){
        let skillIndex = game.skills.allObjects.findIndex((s) => s.id == skillId);
        const namespaceIndex = NamespaceEnum[namespace as keyof typeof NamespaceEnum];
        this.sendLocationById(skillIndex * SkillMult + locationType * ItemTypeMult + namespaceIndex * NamespaceMult + id);
    }

    public sendLocationById(id : number){
        this.connectionHandler.sendLocation(id);
    }
}