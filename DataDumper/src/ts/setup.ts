import "../css/styles.css";
import IconPath from "../img/icon.png";
import LargeIconPath from "../img/icon_large.png";

import { Dumper } from "./dumper";

let Icon : any;
let LargeIcon : any;

export async function setup(ctx: ModContext) {
  Icon = ctx.getResourceUrl(IconPath);
  LargeIcon = ctx.getResourceUrl(LargeIconPath);

  //@ts-ignore
  game.dumper = new Dumper();
}