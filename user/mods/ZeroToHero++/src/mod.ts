import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";
import { LogBackgroundColor } from "@spt-aki/models/spt/logging/LogBackgroundColor";
import { readFileSync } from "fs";
import { join } from "path";

class Mod implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const profileName = "SPT Zero To Hero++";
        const tables = databaseServer.getTables();
        const EoDProfile = tables.templates.profiles["Edge Of Darkness"];
        const zthProfile = JSON.parse(JSON.stringify(EoDProfile));
        const bearInventoryData = JSON.parse(readFileSync(join(__dirname, "./bear_inventory.json"), "utf-8"));
        const usecInventoryData = JSON.parse(readFileSync(join(__dirname, "./usec_inventory.json"), "utf-8"));
        const traderStanding = JSON.parse(readFileSync(join(__dirname, "./traders.json"), "utf-8"));
        const description = JSON.parse(readFileSync(join(__dirname, "./descLocale.json"), "utf-8"));
        zthProfile.bear.character.Inventory = bearInventoryData;
        zthProfile.usec.character.Inventory = usecInventoryData;
        zthProfile.bear.trader = traderStanding;
        zthProfile.usec.trader = traderStanding;
        zthProfile.descriptionLocaleKey = description;
        tables.templates.profiles[profileName] = zthProfile;
        logger.logWithColor("[Launcher Profile] ZeroToHero++ preset added successfully", LogTextColor.GREEN);
    }
}

module.exports = { mod: new Mod() };