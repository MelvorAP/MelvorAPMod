
export const stats = {
    expGain: 0,
    masteryGain: 0,
    currencyGain: 0,
    slayerCoinGain: 0,
    maxMasteryPoolCap: 0,
    bankSpaceIncrease: 0
  };

export function setSlotData(ctx, slotData){
    stats.expGain = slotData.exp_gain;
    stats.masteryGain = slotData.mastery_gain;
    
    stats.currencyGain = slotData.currency_gain;
    stats.slayerCoinGain = slotData.slayer_gain;
    
    stats.maxMasteryPoolCap = slotData.max_mastery_pool_cap;
    stats.bankSpaceIncrease = slotData.bank_space_increase;

    setModifier("melvorD:skillXP", stats.expGain);
    setModifier("melvorD:masteryXP", stats.masteryGain);
    
    setModifier("melvorD:currencyGain", stats.currencyGain);
    setModifier("melvorD:currencyGainFromSlayerTasks", stats.slayerCoinGain);
    
    setModifier("melvorD:masteryPoolCap", stats.maxMasteryPoolCap);
    setModifier("melvorD:bankSpace", stats.bankSpaceIncrease);
}

function setModifier(skill, gain){
  if(gain == 0){
    return;
  }

  const modifierValue = new ModifierValue(game.modifierRegistry.getObjectByID(skill), gain, "archipelago");
  
  // Create a stat provider with the modifier bonuses in it
  const statObject = {
    modifiers: [modifierValue]
  };
  
  const statProvider = new StatProvider();
  statProvider.addStatObject({ name: "Archipelago boost" }, statObject);
  
  // Register the stat provider on the combat manager
  game.combat.registerStatProvider(statProvider);
  
  // Ensure the stat calculations and UI are up-to-date
  game.combat.computeAllStats();
}