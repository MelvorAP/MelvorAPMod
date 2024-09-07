export interface SettingsSection {
    get: (name: string) => unknown;
    set: (name: string, value: any) => void;
    add: (config: SettingConfig | SettingConfig[]) => void;
};

export class SettingsManager{
  apConnectionSection : SettingsSection = {} as SettingsSection;

  constructor(ctx: ModContext){
    this.apConnectionSection = ctx.settings.section("Connection");

    var settings : SettingConfig[] = [];

    settings.push({
      type: "text",
      name: "ap-hostname",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    } as SettingConfig)

    settings.push({
      type: "number",
      name: "ap-port",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    } as SettingConfig)

    settings.push({
      type: "text",
      name: "ap-hostname",
      label: "Host name",
      hint: "Host name of the AP world, for example archipelago.gg",
      default: "archipelago.gg"
    } as SettingConfig)

    settings.push({
      type: "text",
      name: "ap-password",
      label: "Password",
      hint: "Password of the AP room",
      default: ""
    } as SettingConfig);

      this.apConnectionSection.add(settings);
  }
}