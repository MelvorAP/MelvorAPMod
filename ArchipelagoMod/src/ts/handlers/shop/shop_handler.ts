import { OtherPrefix } from "../../data/items";
import { ConnectionHandler } from "../connection_handler";
import { ApShopPurchase } from "./ApShopPurchase";
import { ShopPurchaseRequirementData, ShopPurchaseRequirementType, ShopUnlockRequirement, ShopUnlockRequirementData, ShopUnlockRequirementType } from "./requirements/shop_requirement";

export class ShopHandler{
    private apIcon : string;

    private characterStorage : ModStorage;

    private ctx: ModContext;
    private connectionHandler : ConnectionHandler;

    public test : ShopPurchaseMadeEventMatcher;

    constructor(ctx : ModContext, connectionHandler : ConnectionHandler, apIcon : string){
        this.apIcon = apIcon;
        this.ctx = ctx;

        this.characterStorage = {} as ModStorage;
        this.connectionHandler = connectionHandler;

        // console.log(game.shop.getPurchaseCount(game.shop.purchases.getObjectByID("melvorD:Iron_Axe")));
        // console.log(game.shop.isUpgradePurchased(game.shop.purchases.getObjectByID("melvorD:Iron_Axe")));

        
        let data = {
            type : "ShopPurchaseMade",
            purchaseIDs : undefined
        }
        
        //@ts-ignore
        this.test = game.events.constructMatcher(data) as ShopPurchaseMadeEventMatcher;

        //@ts-ignore
        this.test.assignHandler((e : ShopPurchaseMadeEvent) => {
            if(e.purchase instanceof ApShopPurchase){
                this.connectionHandler.sendLocation(e.purchase.locationId);
            }
        })
    }

    public setCharacterStorage(characterStorage : ModStorage){
        this.characterStorage = characterStorage;
    }

    public lockShopItems(){
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
                    {
                        // @ts-ignore
                        throw new Error(`Error modifying ShopPurchase with id: ${this.id}. Gamemode with id: ${gamemodeID} is not registered.`);
                    }
                    //@ts-ignore
                    if(!(this instanceof ApShopPurchase)){
                        // @ts-ignore
                        // Remove shop items
                        this.unlockRequirements = game.getRequirementsFromData(newRequirements);     
                    }               
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

    public addShopLocations(count : number) {

    }

    public addShopLocation(index : number, locationId : number, name : string | undefined, description : string | undefined, icon : string | undefined) {
        let namespace = {
            name : "archipelago",
            displayName : "archipelago",
            isModded : true
        } as DataNamespace

        let id = `AP_Shop${index}`;
      
        //@ts-ignore
        let purchaseData = {
            id : id,
            category : game.shop.categories.firstObject.id,
            customName : name ?? id,
            customDescription : description ?? "",
            //TODO: figure out why service.#data.icon_url_large pre-expands if used here
            media : icon ?? "img/iconLarge.png",
            allowQuantityPurchase : false,
            defaultBuyLimit : 1,
            cost : {
            currencies : [
                {
                currency : "melvorD:GP",
                cost : 1,
                type : "Fixed"
                }
            ],
            items : []
            },
            contains : { items  : []},
            unlockRequirements : [],
            purchaseRequirements : [],
            buyLimitOverrides : [],
            showBuyLimit : false,
        } as ShopPurchaseData

        let purchase = new ApShopPurchase(locationId, namespace, purchaseData, game)
        game.shop.purchases.registerObject(purchase)
        game.shop.purchaseDisplayOrder.push(purchase)
    }

    public refreshUI() {
      //@ts-ignore
      shopMenu.tabs.get(game.shop.categories.firstObject)!.menu.purchases = game.shop.purchaseDisplayOrder.filter((purchase) => purchase.category === game.shop.categories.firstObject);

      shopMenu.tabs.forEach((tab : ShopMenuTab) => {
            tab.menu.updateItemSelection();
      })
    }

    public hasShop(){
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
