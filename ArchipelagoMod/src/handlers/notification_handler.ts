export class NotificationHandler{

    apLogoPath : string;

    constructor(ctx : ModContext){
        this.apLogoPath = ctx.getResourceUrl("assets/icon.png");
    }

    sendApNotification(id: number, message : string, isSuccess : boolean, addToLog : boolean){
        if(isSuccess){
            // @ts-ignore
            game.notifications.createSuccessNotification(id, message, this.apLogoPath, 0)
        }
        else{
            // @ts-ignore
            game.notifications.createInfoNotification(id, message, this.apLogoPath, 0)
        }


        if(addToLog){
            console.log(message);
        }
    }

    sendErrorNotification(id: number, message : string, addToLog : boolean){
        // @ts-ignore
        game.notifications.createErrorNotification(id, message)

        if(addToLog){
            console.error(message);
        }
    }

    showApModal(title : string, message : string){
        addModalToQueue({
            title: title,
            html: `<span class="text-dark">${ 
                message
            }</span>`,
            imageUrl: this.apLogoPath,
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: "Archipelago Logo",
        });
    }

    showSkillModal(title : string, message : string, skill : string){
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
}