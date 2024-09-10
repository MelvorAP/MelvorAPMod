export class NotificationHandler{
    private icon : string;
    private iconLarge : string;

    constructor(icon : string, iconLarge : string){
        this.icon = icon;
        this.iconLarge = iconLarge;
    }

    sendApNotification(id: number, message : string, isSuccess : boolean, addToLog : boolean){
        if(isSuccess){
            // @ts-ignore
            game.notifications.createSuccessNotification(id, message, this.icon, 0)
        }
        else{
            // @ts-ignore
            game.notifications.createInfoNotification(id, message, this.icon, 0)
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
            html: `<h5 class="font-w400 text-combat-smoke font-size-sm">${ 
                message
            }</h5>`,
            imageUrl: this.iconLarge,
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: "Archipelago Logo",
        });
    }

    showSkillModal(title : string, message : string, skill : string, images : string[]){
        for(let i = 0; i < images.length; i++){
            message = message.replace("${" + i + "}" , `<img class="skill-icon-xs mr-1" src="${images[i]}">`)
        }

        addModalToQueue({
            title: title,
            html: `<h5 class="font-w400 text-combat-smoke font-size-sm">${ 
                message
            }</h5>`,
            imageUrl: `assets/media/skills/${skill}/${skill}.png`,
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: skill,
        });
    }  
}