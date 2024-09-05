let resourceManager = null;

export function setup(ctx){
    resourceManager = ctx.resourceManager;
}

export function SendApNotification(id, message, isSuccess, addToLog){
    if(isSuccess){
        game.notifications.createSuccessNotification(id, message, resourceManager.apLogo, 0)
    }
    else{
        game.notifications.createInfoNotification(id, message, resourceManager.apLogo, 0)
    }


    if(addToLog){
        console.log(message);
    }
}

export function SendErrorNotification(id, message, addToLog){
    game.notifications.createErrorNotification(id, message)

    if(addToLog){
        console.error(message);
    }
}

export function showApModal(title, message){
    addModalToQueue({
        title: title,
        html: `<span class="text-dark">${ 
            message
        }</span>`,
        imageUrl: resourceManager.apLogo,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: "Archipelago Logo",
      });
}

export function showSkillModal(title, message, skill){
    addModalToQueue({
        title: title,
        html: `<span class="text-dark">${ 
            message
        }</span>`,
        imageUrl: `assets/media/skills/${skill}/${skill}.png`,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: skill,
      });
}