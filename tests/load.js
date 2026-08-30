import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Scripting from 'resource:///org/gnome/shell/ui/scripting.js';

export const METRICS = {
    extensionLoaded: {
        description: 'La extensión registró su indicador en el panel',
        units: 'boolean',
        value: 0,
    },
    notificationSent: {
        description: 'Una alarma inmediata atravesó el notificador',
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
    indicator._alarmManager.add('0', 'Prueba automática');
    await Scripting.sleep(3000);

    if (indicator._alarmManager.getAlarms().length !== 0)
        throw new Error('La alarma inmediata no fue enviada');

    METRICS.notificationSent.value = 1;
}
