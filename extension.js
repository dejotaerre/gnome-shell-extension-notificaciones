// Generated with AI for personal use.
// Do NOT upload to extensions.gnome.org (EGO) unless you understand JavaScript
// and can maintain this code.

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {AlarmManager} from './alarmManager.js';
import {AlarmIndicator} from './indicator.js';

export default class NotificacionesExtension extends Extension {
    enable() {
        this._alarmManager = new AlarmManager(
            this.getSettings(),
            message => Main.notify('Recordatorio', message)
        );
        this._indicator = new AlarmIndicator(this, this._alarmManager);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        this._alarmManager.destroy();
        this._alarmManager = null;
    }
}
