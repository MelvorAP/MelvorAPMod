export class Dumper{
    dumpAllMasterySkills(namespace : string = ""){
    let message = `\tbaseSkillActions = new Map([\n`;
  
    for(let i = 0; i < game.skills.allObjects.length; i++){
      if(game.skills.allObjects[i] instanceof SkillWithMastery){
        message += this.dumpSkillActionList(namespace, game.skills.allObjects[i] as SkillWithMastery<BasicSkillRecipe,any>)
      }
    }
  
    message += `\t])`;
  
    console.log(message);
  }

  dumpAllPetNames(namespace : string = ""){
    let message = "";
  
    game.pets.allObjects.forEach(pet => {
        if(namespace != "" && namespace != pet.namespace){
            return;
        }
        message += `\t"Pet - ${pet.name}",\n`;
    })
  
    console.log(message);
  }
  
  dumpAllCombatAreaInfo(namespace : string = ""){
    let message = "";
    game.combatAreas.allObjects.forEach(area => {
      //@ts-ignore
      if(game.combatAreas.strongholds.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.dungeons.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.abyssDepths.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.slayer.allObjects.includes(area)){
        return;
      }

      if(namespace != "" && namespace != area.namespace){
        return;
        }
  
      area.monsters.forEach(monster => {
        message += `\tLocationData("Combat - Combat Areas - ${area.name} - ${monster.name}",\n`;
        message += `\t\t"Combat Area - ${area.name}",\n`,
        message += `\t\t[],\n`
        message += `\t\t[\n`
  
        monster.lootTable.sortedDropsArray.forEach(loot => {
          message += `\t\t\t"${loot.item.name}",\n`
        })

        if(monster.bones){
            message += `\t\t\t"${monster.bones.item.name}",\n`
        }
  
        message += `\t\t],\n`
        message += `\t\tnamespace = GameNameSpace.${this.getNameSpaceEnum(area.namespace)},\n`
        message += `\t\tlocation_type=LocationType.COMBAT,\n`
        message += `\t\tsource_of_gp=True, combat_type=CombatType.${monster.attackType.toUpperCase()}\n`
        message += `\t\t),\n`
      })
    })
  
    console.log(message);
  }
  
  dumpAllSlayerAreaInfo(namespace : string = ""){
    let message = "";
    game.combatAreas.allObjects.forEach(area => {
      //@ts-ignore
      if(!game.combatAreas.slayer.allObjects.includes(area)){
        return;
      }

      if(namespace != "" && namespace != area.namespace){
        return;
        }
  
      area.monsters.forEach(monster => {
        message += `\tLocationData("Combat - Slayer Areas - ${area.name} - ${monster.name}",\n`;
        message += `\t\t"Slayer Area - ${area.name}",\n`,
        message += `\t\t[],\n`
        message += `\t\t[\n`
  
        monster.lootTable.sortedDropsArray.forEach(loot => {
          message += `\t\t\t"${loot.item.name}",\n`
        })

        if(monster.bones){
            message += `\t\t\t"${monster.bones.item.name}",\n`
        }
  
        message += `\t\t],\n`
        message += `\t\tnamespace = GameNameSpace.${this.getNameSpaceEnum(area.namespace)},\n`
        message += `\t\tlocation_type=LocationType.SLAYER,\n`
        message += `\t\tsource_of_gp=True, combat_type=CombatType.${monster.attackType.toUpperCase()}\n`
        message += `\t\t),\n`
      })
    })
  
    console.log(message);
  }
  
  dumpAllDungeonInfo(namespace : string = ""){
    let message = "";
    game.dungeons.allObjects.forEach(dungeon => {
        if(namespace != "" && namespace != dungeon.namespace){
            return;
            }

        message += `\tLocationData("Combat - Dungeons - ${dungeon.name}",\n`;
        message += `\t\t"Dungeon - ${dungeon.name}",\n`,
        message += `\t\t[],\n`
        message += `\t\t[\n`
  
        dungeon.rewards.forEach(reward => {
          message += `\t\t\t"${reward.name}",\n`
        })
  
        message += `\t\t],\n`
        message += `\t\tnamespace = GameNameSpace.${this.getNameSpaceEnum(dungeon.namespace)},\n`
        message += `\t\tlocation_type=LocationType.DUNGEON,\n`
        message += `\t\tsource_of_gp=False, combat_type=CombatType.ALL\n`
        message += `\t\t),\n`
    })
  
    console.log(message);
  }
  
  dumpAllStrongholdInfo(namespace : string = ""){
    let message = "";
    //@ts-ignore
    game.strongholds.allObjects.forEach(stronghold => {
        if(namespace != "" && namespace != stronghold.namespace){
            return;
            }

      let tierArray = [stronghold.tiers.Standard, stronghold.tiers.Augmented, stronghold.tiers.Superior]
        tierArray.forEach(area => {
          message += `\tLocationData("Combat - Strongholds - ${area.name}",\n`;
          message += `\t\t"Stronghold - ${area.name}",\n`,
          message += `\t\t[],\n`
          message += `\t\t[\n`
    
          area.rewards.items.forEach((reward: AnyItem) => {
            message += `\t\t\t"${reward.name}",\n`
          })
    
          message += `\t\t],\n`
          message += `\t\tnamespace = GameNameSpace.${this.getNameSpaceEnum(area.namespace)},\n`
          message += `\t\tlocation_type=LocationType.STRONGHOLD,\n`
          message += `\t\tsource_of_gp=False, combat_type=CombatType.ALL\n`
          message += `\t\t),\n`
        })
    })
  
    console.log(message);
  }

  dumpAllCombatAreaNames(namespace : string = ""){
    let message = "";
    game.combatAreas.allObjects.forEach(area => {
      //@ts-ignore
      if(game.combatAreas.strongholds.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.dungeons.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.abyssDepths.allObjects.includes(area)){
        return;
      }
      //@ts-ignore
      if(game.combatAreas.slayer.allObjects.includes(area)){
        return;
      }

      if(namespace != "" && namespace != area.namespace){
        return;
      }
  
      area.monsters.forEach(monster => {
        message += `\t"Combat - Combat Areas - ${area.name} - ${monster.name}",\n`;
      })
    })
  
    console.log(message);
  }

  dumpAllSlayerAreaNames(namespace : string = ""){
    let message = "";
    //@ts-ignore
    game.slayer.allObjects.forEach(area => {
        if(namespace != "" && namespace != area.namespace){
            return;
        }
        area.monsters.forEach((monster: Monster) => {
        message += `\tCombat - Slayer Areas - ${area.name} - ${monster.name}",\n`;
      })
    })
  
    console.log(message);
  }

  dumpAllDungeonNames(namespace : string = ""){
    let message = "";
    game.dungeons.allObjects.forEach(dungeon => {
        if(namespace != "" && namespace != dungeon.namespace){
            return;
        }
        message += `\t"Combat - Dungeons - ${dungeon.name}",\n`;
    })
  
    console.log(message);
  }

  dumpAllStrongholdNames(namespace : string = ""){
    let message = "";
    //@ts-ignore
    game.strongholds.allObjects.forEach(stronghold => {
        if(namespace != "" && namespace != stronghold.namespace){
            return;
        }
        message += `\t"Combat - Strongholds - ${stronghold.name}",\n`;
    })
  
    console.log(message);
  }

  dumpAllAbyssDepthsNames(namespace : string = ""){
    let message = "";
    //@ts-ignore
    game.abyssDepths.allObjects.forEach(abyss => {
        if(namespace != "" && namespace != abyss.namespace){
            return;
        }
        message += `\t"Combat - Abyss Depths - ${abyss.name}",\n`;
    })
  
    console.log(message);
  }

  private dumpSkillActionList(namespace : string = "", skill : SkillWithMastery<BasicSkillRecipe,any>) : string{
    let message = `\t\t["${skill.id}", [\n`;
  
    for(let i = 0; i < skill.actions.allObjects.length; i++){
        if(namespace != "" && namespace != skill.actions.allObjects[i].namespace){
            continue;
        }
      message += `\t\t\t[${i}, "${skill.actions.allObjects[i].id}"],\n`
    }
  
    message += `\t\t]],\n`
  
    return message;
  }

  private getNameSpaceEnum(namespaceId : string) : string{
    switch(namespaceId){
        case "melvorD":
            return "DEMO";
        case "melvorF":
            return "FULL";
        case "melvorTotH":
            return "TOTH";
        case "melvorAoD":
            return "AOD";
        case "melvorItA":
            return "ITA";
        default:
            return "UNKNOWN";
    }
  }
}