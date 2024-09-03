
export const stats = {
    exp_gain: 1
  };

export function setSlotData(ctx, slotData){
    stats.exp_gain = slotData.exp_gain

    ctx.patch(Skill, 'addXP').before(function(amount, masteryAction) {
        return [amount * stats.exp_gain, masteryAction];
      });
}