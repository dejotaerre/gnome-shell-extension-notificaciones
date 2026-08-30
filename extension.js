import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {AlarmManager} from './alarmManager.js';
import {AlarmIndicator} from './indicator.js';
import {Notifier} from './notifier.js';

export default class NotificacionesExtension extends Extension {
    enable() {
        this._notifier = new Notifier();
        this._alarmManager = new AlarmManager(
            this.getSettings(),
            message => this._notifier.notify(message)
        );
        this._indicator = new AlarmIndicator(this, this._alarmManager);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
        this._alarmManager.destroy();
        this._alarmManager = null;
        this._notifier.destroy();
        this._notifier = null;
    }
}
