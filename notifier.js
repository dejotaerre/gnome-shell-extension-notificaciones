import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

const NotificationPolicy = GObject.registerClass(
class NotificationPolicy extends MessageTray.NotificationPolicy {
    get enable() {
        return true;
    }

    get enableSound() {
        return true;
    }

    get showBanners() {
        return true;
    }

    get forceExpanded() {
        return false;
    }

    get showInLockScreen() {
        return false;
    }

    get detailsInLockScreen() {
        return false;
    }

    store() {
    }
});

export class Notifier {
    constructor() {
        this._source = null;
    }

    notify(message) {
        const source = this._getSource();
        const notification = new MessageTray.Notification({
            source,
            title: 'Recordatorio',
            body: message,
            iconName: 'alarm-symbolic',
            sound: new MessageTray.Sound(null, 'alarm-clock-elapsed'),
            urgency: MessageTray.Urgency.NORMAL,
        });

        notification.playSound();
        notification.sound = null;
        source.addNotification(notification);
    }

    destroy() {
        if (this._source)
            this._source.destroy();

        this._source = null;
    }

    _getSource() {
        if (this._source)
            return this._source;

        this._source = new MessageTray.Source({
            title: 'Notificaciones programadas',
            iconName: 'alarm-symbolic',
            policy: new NotificationPolicy(),
        });
        this._source.connect('destroy', () => {
            this._source = null;
        });
        Main.messageTray.add(this._source);

        return this._source;
    }
}
