import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Scripting from 'resource:///org/gnome/shell/ui/scripting.js';

export const METRICS = {
    extensionLoaded: {
        description: 'La extensión registró su indicador en el panel',
        units: 'boolean',
        value: 0,
    },
};

export async function run() {
    await Scripting.sleep(1000);

    const indicator = Main.panel.statusArea['notificaciones@dejotaerre.github.io'];
    if (!indicator)
        throw new Error('No se encontró el indicador de Notificaciones');

    METRICS.extensionLoaded.value = 1;
}
