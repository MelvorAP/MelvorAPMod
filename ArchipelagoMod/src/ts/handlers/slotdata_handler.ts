export interface GamemodeSettings {
  itemDoubling: boolean,
  preservation: boolean,
  isPermaDeath: boolean,
  hasRegen: boolean,
};

export interface PlayerStats {
  expGain: number,
  masteryGain: number,
  currencyGain: number,
  slayerCoinGain: number,
  maxMasteryPoolCap: number,
  bankSpaceIncrease: number
};

export class SlotdataHandler{
  gamemodeSettings : GamemodeSettings = {} as GamemodeSettings;
  playerStats : PlayerStats = {} as PlayerStats;

  modifiers : Map<string, any> = new Map();

  constructor(){
    this.gamemodeSettings = {
      itemDoubling: false,
      preservation: false,
      isPermaDeath: false,
      hasRegen: true
    };

    this.playerStats = {
      expGain: 0,
      masteryGain: 0,
      currencyGain: 0,
      slayerCoinGain: 0,
      maxMasteryPoolCap: 0,
      bankSpaceIncrease: 0
    }
  }

  setSlotData(slotData : any){  
      this.gamemodeSettings.itemDoubling = !slotData.item_doubling;
      this.gamemodeSettings.preservation = !slotData.preservation;

      this.gamemodeSettings.isPermaDeath = slotData.is_perma_death;
      this.gamemodeSettings.hasRegen = slotData.has_regen;

      this.playerStats.expGain = slotData.exp_gain;
      this.playerStats.masteryGain = slotData.mastery_gain;
        
      this.playerStats.currencyGain = slotData.currency_gain;
      this.playerStats.slayerCoinGain = slotData.slayer_gain;
        
      this.playerStats.maxMasteryPoolCap = slotData.max_mastery_pool_cap;
      this.playerStats.bankSpaceIncrease = slotData.bank_space_increase;

      this.updateGamemode();
      this.updateModifiers();
  }

  updateGamemode(){
    // @ts-ignore
    game.currentGamemode.disableItemDoubling = !this.gamemodeSettings.itemDoubling;
    // @ts-ignore
    game.currentGamemode.disablePreservation = !this.gamemodeSettings.preservation;
    game.currentGamemode.isPermaDeath = this.gamemodeSettings.isPermaDeath;
    game.currentGamemode.hasRegen = this.gamemodeSettings.hasRegen;
  }

  updateModifiers(){
    this.setModifier("melvorD:skillXP", this.playerStats.expGain, "Archipelago Exp Boost", false);
    this.setModifier("melvorD:masteryXP", this.playerStats.masteryGain, "Archipelago Mastery Boost", false);
      
    this.setModifier("melvorD:currencyGain", this.playerStats.currencyGain, "Archipelago Currency Boost", false);
    this.setModifier("melvorD:currencyGainFromSlayerTasks", this.playerStats.slayerCoinGain, "Archipelago Slayer Coin Boost", false);
      
    this.setModifier("melvorD:masteryPoolCap", this.playerStats.maxMasteryPoolCap, "Archipelago Mastery Pool Cap", false);
    this.setModifier("melvorD:bankSpace", this.playerStats.bankSpaceIncrease, "Archipelago Bank Space", false);
  }

  setModifier(skill : string, gain : number, modifierName : string, allowEnemy : boolean){
    if(!gain){
      console.warn(skill, "slotData is NAN!");
      return;
    }

    // @ts-ignore
    let modifier = null;

    if(this.modifiers.has(skill)){
      // @ts-ignore
      modifier = this.modifiers[skill];
      modifier.value = gain;
    }
    else{
      // @ts-ignore
      modifier = new ModifierValue(game.modifierRegistry.getObjectByID(skill), gain, "archipelago");

      this.modifiers.set(skill, modifier);

        // Create a stat provider with the modifier bonuses in it
      const statObject = { 
        modifiers: [modifier]
      };

      modifier.allowEnemy = allowEnemy;
      modifier.disabled = gain == 0;

      // @ts-ignore
      const statProvider = new StatProvider();
      statProvider.addStatObject({ name: modifierName }, statObject);
  
      // @ts-ignore
      game.combat.registerStatProvider(statProvider);
    }

    // @ts-ignore
    game.combat.computeAllStats();
  }
}