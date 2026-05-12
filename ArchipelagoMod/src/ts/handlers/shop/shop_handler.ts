import { OtherPrefix } from "../../data/items";
import { ShopRequirementData, ShopRequirementType } from "./requirements/shop_requirement";

export class ShopHandler{
    private apIcon : string;

    private characterStorage : ModStorage;

    private ctx: ModContext;

    constructor(ctx : ModContext, apIcon : string){
        this.apIcon = apIcon;
        this.ctx = ctx;

        this.characterStorage = {} as ModStorage;

        // console.log(game.shop.getPurchaseCount(game.shop.purchases.getObjectByID("melvorD:Iron_Axe")));
        // console.log(game.shop.isUpgradePurchased(game.shop.purchases.getObjectByID("melvorD:Iron_Axe")));
        
    }

    setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    lockShopItems(){
        // @ts-ignore
        this.ctx.patch(ShopCostsAndUnlock, "updatePurchaseRequirements").before(function(_returnValue) {
            //@ts-ignore
            if (!this.addedApRequirement && this.purchase.purchaseRequirements.length > 0) {
                //@ts-ignore
                this.createPurchaseRequirements();
            }
            //@ts-ignore
            this.addedApRequirement = true;
        });

        for(let purchase of game.shop.purchases.allObjects){
            //Hide pets in shop
            if(purchase.contains.pet){
                //@ts-ignore
                purchase.unlockRequirements.push(this.createApRequirementData("a", "a"));
                //shopMenu.tabs.get(purchase.category)?.menu.updateItemSelection();
            }
            //@ts-ignore
            purchase.applyDataModification({purchaseRequirements : [{
                gamemodeID : "archipelago:apGameMode", 
                newRequirements : [this.createApRequirementData(purchase.id, "purchase")]
            }]}, game)
        }

        game.shop.renderQueue.costs = true;
        game.shop.renderQueue.requirements = true;
    }

    
    hasShop(){
        return this.characterStorage.getItem(OtherPrefix + "Shop_Unlock")
    }

    protected createApRequirementData(itemId : string, itemType : string) : ShopRequirementData{
        
        return {
            type: ShopRequirementType,
            itemId : itemId,
            itemType : itemType,
            iconUrl: this.apIcon,
            shopUnlockHandler : this

        } as ShopRequirementData;
    }
}
