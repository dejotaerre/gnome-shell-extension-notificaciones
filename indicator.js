import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export const AlarmIndicator = GObject.registerClass(
class AlarmIndicator extends PanelMenu.Button {
    constructor(extension, alarmManager) {
        super(0, 'Notificaciones programadas');
        this._alarmManager = alarmManager;

        const iconPath = extension.path.concat('/icons/alarm-symbolic.svg');
        this.add_child(new St.Icon({
            gicon: new Gio.FileIcon({file: Gio.File.new_for_path(iconPath)}),
            style_class: 'system-status-icon',
        }));

        this._buildForm();
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this._alarmSection = new PopupMenu.PopupMenuSection();
        this.menu.addMenuItem(this._alarmSection);

        this._alarmManager.setChangedCallback(() => this._refreshAlarms());
        this._refreshAlarms();
    }

    destroy() {
        this._alarmManager.setChangedCallback(null);
        this._alarmManager = null;
        super.destroy();
    }

    _buildForm() {
        const formItem = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
            can_focus: false,
        });
        const form = new St.BoxLayout({
            orientation: Clutter.Orientation.VERTICAL,
            style_class: 'notificaciones-form',
        });

        form.add_child(new St.Label({
            text: 'Programar notificación',
            style_class: 'notificaciones-title',
        }));

        this._timeEntry = new St.Entry({
            hint_text: 'Minutos o HH:MM',
            can_focus: true,
            x_expand: true,
        });
        form.add_child(this._timeEntry);

        this._messageEntry = new St.Entry({
            hint_text: 'Mensaje',
            can_focus: true,
            x_expand: true,
        });
        this._messageEntry.clutter_text.connect('activate', () => this._addAlarm());
        form.add_child(this._messageEntry);

        const button = new St.Button({
            label: 'Programar',
            style_class: 'button notificaciones-button',
            can_focus: true,
            x_align: Clutter.ActorAlign.END,
        });
        button.connect('clicked', () => this._addAlarm());
        form.add_child(button);

        this._statusLabel = new St.Label({
            text: '',
            style_class: 'notificaciones-status',
        });
        form.add_child(this._statusLabel);

        formItem.add_child(form);
        this.menu.addMenuItem(formItem);
    }

    _addAlarm() {
        const timeText = this._timeEntry.get_text().trim();
        const message = this._messageEntry.get_text().trim();

        if (!message) {
            this._setStatus('Escribe un mensaje', true);
            return;
        }

        try {
            const alarm = this._alarmManager.add(timeText, message);
            const date = GLib.DateTime.new_from_unix_local(alarm.timestamp);
            this._setStatus(`Programada para ${date.format('%d/%m %H:%M')}`, false);
            this._timeEntry.set_text('');
            this._messageEntry.set_text('');
        } catch (error) {
            this._setStatus(error.message, true);
        }
    }

    _setStatus(text, isError) {
        this._statusLabel.text = text;
        this._statusLabel.style_class = isError
            ? 'notificaciones-status notificaciones-error'
            : 'notificaciones-status';
    }

    _refreshAlarms() {
        this._alarmSection.removeAll();
        const alarms = this._alarmManager.getAlarms();

        if (alarms.length === 0) {
            const emptyItem = new PopupMenu.PopupMenuItem('No hay alarmas pendientes', {
                reactive: false,
            });
            this._alarmSection.addMenuItem(emptyItem);
            return;
        }

        for (const alarm of alarms) {
            const date = GLib.DateTime.new_from_unix_local(alarm.timestamp);
            const item = new PopupMenu.PopupBaseMenuItem();
            const label = new St.Label({
                text: `${date.format('%d/%m %H:%M')} — ${alarm.message}`,
                x_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            const cancelButton = new St.Button({
                child: new St.Icon({icon_name: 'edit-delete-symbolic'}),
                style_class: 'button notificaciones-cancel-button',
                can_focus: true,
                accessible_name: `Cancelar ${alarm.message}`,
            });
            cancelButton.connect('clicked', () => this._alarmManager.cancel(alarm.id));

            item.add_child(label);
            item.add_child(cancelButton);
            this._alarmSection.addMenuItem(item);
        }
    }
});
