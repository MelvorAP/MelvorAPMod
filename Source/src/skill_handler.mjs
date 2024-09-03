export function unlockSkill(skillName){
    game.skills.getObjectByID(skillName).setUnlock(true);
}

export function lockSkills(){
    game.attack.setUnlock(false);
    game.strength.setUnlock(false);
    game.defence.setUnlock(false);
    game.hitpoints.setUnlock(false);
    game.ranged.setUnlock(false);
    game.altMagic.setUnlock(false);
    game.prayer.setUnlock(false);
    game.slayer.setUnlock(false);
    game.woodcutting.setUnlock(false);
    game.fishing.setUnlock(false);
    game.firemaking.setUnlock(false);
    game.cooking.setUnlock(false);
    game.mining.setUnlock(false);
    game.smithing.setUnlock(false);
    game.thieving.setUnlock(false);
    game.farming.setUnlock(false);
    game.fletching.setUnlock(false);
    game.crafting.setUnlock(false);
    game.runecrafting.setUnlock(false);
    game.herblore.setUnlock(false);
    game.agility.setUnlock(false);
    game.summoning.setUnlock(false);
    game.astrology.setUnlock(false);
    game.township.setUnlock(false);
  }