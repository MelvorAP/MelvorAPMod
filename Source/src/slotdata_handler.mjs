export const gamemodeSettings = {
  itemDoubling: false,
  preservation: false,
  isPermaDeath: false,
  hasRegen: true,
};

export const playerStats = {
    expGain: 0,
    masteryGain: 0,
    currencyGain: 0,
    slayerCoinGain: 0,
    maxMasteryPoolCap: 0,
    bankSpaceIncrease: 0
  };

  let modifiers = new Map();

export function setSlotData(slotData){  
  gamemodeSettings.itemDoubling = !slotData.item_doubling;
  gamemodeSettings.preservation = !slotData.preservation;

  gamemodeSettings.isPermaDeath = slotData.is_perma_death;
  gamemodeSettings.hasRegen = slotData.has_regen;

  playerStats.expGain = slotData.exp_gain;
  playerStats.masteryGain = slotData.mastery_gain;
    
  playerStats.currencyGain = slotData.currency_gain;
  playerStats.slayerCoinGain = slotData.slayer_gain;
    
  playerStats.maxMasteryPoolCap = slotData.max_mastery_pool_cap;
  playerStats.bankSpaceIncrease = slotData.bank_space_increase;

  updateGamemode();
  updateModifiers();
}

function updateGamemode(){
  game.currentGamemode.disableItemDoubling = !gamemodeSettings.itemDoubling;
  game.currentGamemode.disablePreservation = !gamemodeSettings.preservation;
  game.currentGamemode.isPermaDeath = gamemodeSettings.isPermaDeath;
  game.currentGamemode.hasRegen = gamemodeSettings.hasRegen;
}

function updateModifiers(){
  setModifier("melvorD:skillXP", playerStats.expGain, "Archipelago Exp Boost", false);
  setModifier("melvorD:masteryXP", playerStats.masteryGain, "Archipelago Mastery Boost", false);
    
  setModifier("melvorD:currencyGain", playerStats.currencyGain, "Archipelago Currency Boost", false);
  setModifier("melvorD:currencyGainFromSlayerTasks", playerStats.slayerCoinGain, "Archipelago Slayer Coin Boost", false);
    
  setModifier("melvorD:masteryPoolCap", playerStats.maxMasteryPoolCap, "Archipelago Mastery Pool Cap", false);
  setModifier("melvorD:bankSpace", playerStats.bankSpaceIncrease, "Archipelago Bank Space", false);
}

function setModifier(skill, gain, modifierName, allowEnemy){
  if(!gain){
    console.warn(skill, "slotData is NAN!");
    return;
  }

  let modifier = null;

  if(modifiers.has(skill)){
    modifier = modifiers[skill];
    modifier.value = gain;
  }
  else{
    modifier = new ModifierValue(game.modifierRegistry.getObjectByID(skill), gain, "archipelago");

    modifiers[skill] = modifier;

      // Create a stat provider with the modifier bonuses in it
    const statObject = { 
      modifiers: [modifier]
    };

    modifier.allowEnemy = allowEnemy;
    modifier.disabled = gain == 0;

    const statProvider = new StatProvider();
    statProvider.addStatObject({ name: modifierName }, statObject);
 
    // Register the stat provider on the combat manager
    game.combat.registerStatProvider(statProvider);
  }

  // Ensure the stat calculations and UI are up-to-date
  game.combat.computeAllStats();
}