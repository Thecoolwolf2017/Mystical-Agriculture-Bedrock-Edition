import { system } from "@minecraft/server";
export function sendNotification(player, message, icon, playSound) {
    if (playSound === undefined || playSound)
        player.playSound("random.toast_recipe_unlocking_in");
    player.onScreenDisplay.setTitle(`notification.${message}`, { subtitle: `notification.${icon}`, fadeInDuration: 0, fadeOutDuration: 0, stayDuration: 1 });
    if (playSound === undefined || playSound)
        system.runTimeout(() => {
            if (player /*&& player.isValid()*/)
                player.playSound("random.toast_recipe_unlocking_out");
        }, 108);
}