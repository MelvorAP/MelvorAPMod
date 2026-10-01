import { OtherPrefix } from "../../data/items";
import { ShopPurchaseRequirementData, ShopPurchaseRequirementType, ShopUnlockRequirement, ShopUnlockRequirementData, ShopUnlockRequirementType } from "./requirements/shop_requirement";

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

        // @ts-ignore
        this.ctx.patch(ShopPurchase, "applyDataModification").replace(function(o, modData, game : Game) {
            if (modData.unlockRequirements !== undefined) {
                // @ts-ignore
                modData.unlockRequirements.forEach(({ gamemodeID, newRequirements }) => {
                    const mode = game.gamemodes.getObjectByID(gamemodeID);
                    if (mode === undefined)
                        // @ts-ignore
                        throw new Error(`Error modifying ShopPurchase with id: ${this.id}. Gamemode with id: ${gamemodeID} is not registered.`);
                    // @ts-ignore
                    // Remove shop items
                    this.unlockRequirements = game.getRequirementsFromData(newRequirements);
                    // @ts-ignore
                    console.log(this.unlockRequirements);
                    
                });
            }
            else{
                o(modData, game);
            }
        });
        
        // @ts-ignore
        this.ctx.patch(Shop, "getLowestUpgradeInChain").replace(function(o, purchase : ShopPurchase) {
            while (true) {
                while (true) {
                    //@ts-ignore
                    if (this.isUpgradePurchased(purchase))
                        return purchase;
                    if (purchase.unlockRequirements[0] !== undefined) {
                        //@ts-ignore
                        if(purchase.unlockRequirements[0].type == ShopUnlockRequirementType){
                            return undefined;
                        }
                        purchase = purchase.unlockRequirements[0].purchase;
                    }
                    else {
                        return undefined;
                    }
                }
            }
        });

        for(let purchase of game.shop.purchases.allObjects){
            //Hide pets in shop
            //if(purchase.contains.pet){
                //@ts-ignore
            //    purchase.unlockRequirements.push(this.createApUnlockRequirementData(purchase.id, "purchase"));
            //}
            //@ts-ignore
            purchase.applyDataModification({purchaseRequirements : [{
                gamemodeID : "archipelago:apGameMode", 
                newRequirements : [this.createApPurchaseRequirementData(purchase.id, "purchase")]
            }]}, game)
            //@ts-ignore
            purchase.applyDataModification({unlockRequirements : [{
                gamemodeID : "archipelago:apGameMode", 
                newRequirements : [this.createApUnlockRequirementData(purchase.id, "purchase")]
            }]}, game)
        }

        shopMenu.tabs.forEach((tab : ShopMenuTab) => {
            tab.menu.updateItemSelection();
        })

        game.shop.renderQueue.costs = true;
        game.shop.renderQueue.requirements = true;
    }

    
    hasShop(){
        return this.characterStorage.getItem(OtherPrefix + "Shop_Unlock")
    }

    protected createApPurchaseRequirementData(itemId : string, itemType : string) : ShopPurchaseRequirementData{
        
        return {
            type: ShopPurchaseRequirementType,
            itemId : itemId,
            itemType : itemType,
            iconUrl: this.apIcon,
            shopUnlockHandler : this

        } as ShopPurchaseRequirementData;
    }

        protected createApUnlockRequirementData(itemId : string, itemType : string) : ShopUnlockRequirementData{
        
        return {
            type: ShopUnlockRequirementType,
            itemId : itemId,
            itemType : itemType,
            iconUrl: this.apIcon,
            shopUnlockHandler : this

        } as ShopUnlockRequirementData;
    }
}
