// @ts-ignore
export class APRequirement extends GameRequirement {
    type: string;
    itemId: string;
    itemType: string;
    iconUrl: string;

    constructor(game : Game, type : string, itemId : string, itemType : string, iconUrl : string) {
        super (game);

        this.type = type;
        this.itemId = itemId;
        this.itemType = itemType;
        this.iconUrl = iconUrl;
    }

    public notifyFailure() {
        //@ts-ignore
        game.notificationHandler.showApModal("Locked!", `Find this ${this.itemType} in the multiworld to access it!`, [])
    }

    // @ts-ignore
    public getHandler(callback) {
        return (e : any) => {
        if (e.itemId === this.itemId){
            callback(e);
        }
        else{
            console.log();
        }
        };
    }

    // @ts-ignore
    public _assignHandler(handler) {
        // @ts-ignore
        game.completion.on('apItemsChangedEvent', handler);
    }

    // @ts-ignore
    public _unassignHandler(handler) {
        // @ts-ignore
        game.completion.off('apItemsChangedEvent', handler);
    }

    public getNodes(imageClass : string) : (Node)[] {
        // @ts-ignore
        return templateStringWithNodes('Find this ${itemType} in the ${apImage}AP world to unlock it.', { apImage: this.createImage(this.iconUrl, imageClass) }, {itemType: this.itemType}, false);
    }

    public getContainer(imageClass : string) : HTMLElement{
        let element = document.createElement('div');
        element.append(...this.getNodes(imageClass))
        element.classList.add("text-danger", "ap-requirement");
        return element
    }
}