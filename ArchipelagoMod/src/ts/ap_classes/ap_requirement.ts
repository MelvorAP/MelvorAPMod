// @ts-ignore
export class APRequirement extends GameRequirement {
    itemId: string;
    itemType: string;
    iconUrl: string;

    constructor(game : Game, itemId : string, itemType : string, iconUrl : string) {
        super (game);

        this.itemId = itemId;
        this.itemType = itemType;
        this.iconUrl = iconUrl;
    }

    notifyFailure() {
        //@ts-ignore
        game.notificationHandler.showApModal("Something went wrong", "Something went wrong")
    }

    // @ts-ignore
    getHandler(callback) {
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
    _assignHandler(handler) {
        // @ts-ignore
        game.completion.on('apItemsChangedEvent', handler);
    }

    // @ts-ignore
    _unassignHandler(handler) {
        // @ts-ignore
        game.completion.off('apItemsChangedEvent', handler);
    }

    getNodes(imageClass : string) : (Node)[] {
        // @ts-ignore
        return templateStringWithNodes('Find this ${itemType} in the ${apImage}AP world to unlock it.', { apImage: this.createImage(this.iconUrl, imageClass) }, {itemType: this.itemType}, false);
    }

    getContainer(imageClass : string) : HTMLElement{
        let element = document.createElement('div');
        element.append(...this.getNodes(imageClass))
        element.classList.add("text-danger", "ap-requirement");
        return element
    }
}