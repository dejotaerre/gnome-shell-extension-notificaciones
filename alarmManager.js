import GLib from 'gi://GLib';

const SETTINGS_KEY = 'alarms';

export class AlarmManager {
    constructor(settings, notifyCallback) {
        this._settings = settings;
        this._notifyCallback = notifyCallback;
        this._sources = new Map();
        this._changedCallback = null;
        this._alarms = this._load();
        this._restore();
    }

    setChangedCallback(callback) {
        this._changedCallback = callback;
    }

    getAlarms() {
        return [...this._alarms].sort((first, second) => first.timestamp - second.timestamp);
    }

    add(timeText, message) {
        const timestamp = this._parseTime(timeText);
        const alarm = {
            id: `${GLib.get_real_time()}`,
            message,
            timestamp,
        };

        this._alarms.push(alarm);
        this._save();
        this._schedule(alarm);
        this._emitChanged();
        return alarm;
    }

    cancel(id) {
        const sourceId = this._sources.get(id);
        if (sourceId) {
            GLib.Source.remove(sourceId);
            this._sources.delete(id);
        }

        this._alarms = this._alarms.filter(alarm => alarm.id !== id);
        this._save();
        this._emitChanged();
    }

    destroy() {
        for (const sourceId of this._sources.values())
            GLib.Source.remove(sourceId);

        this._sources.clear();
        this._changedCallback = null;
        this._notifyCallback = null;
        this._settings = null;
    }

    _load() {
        const stored = this._settings.get_string(SETTINGS_KEY);

        try {
            const alarms = JSON.parse(stored);
            return Array.isArray(alarms) ? alarms : [];
        } catch (error) {
            console.warn(`No se pudieron leer las alarmas guardadas: ${error.message}`);
            return [];
        }
    }

    _save() {
        this._settings.set_string(SETTINGS_KEY, JSON.stringify(this._alarms));
    }

    _restore() {
        const now = Math.floor(Date.now() / 1000);

        for (const alarm of [...this._alarms]) {
            if (alarm.timestamp <= now)
                this._fire(alarm.id);
            else
                this._schedule(alarm);
        }
    }

    _schedule(alarm) {
        const now = Math.floor(Date.now() / 1000);
        const delay = Math.max(1, alarm.timestamp - now);
        const sourceId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, delay, () => {
            this._sources.delete(alarm.id);
            this._fire(alarm.id);
            return GLib.SOURCE_REMOVE;
        });

        this._sources.set(alarm.id, sourceId);
    }

    _fire(id) {
        const alarm = this._alarms.find(item => item.id === id);
        if (!alarm)
            return;

        this._notifyCallback(alarm.message);
        this._alarms = this._alarms.filter(item => item.id !== id);
        this._save();
        this._emitChanged();
    }

    _parseTime(timeText) {
        if (/^[0-9]+$/.test(timeText)) {
            const minutes = Number.parseInt(timeText, 10);
            return Math.floor(Date.now() / 1000) + minutes * 60;
        }

        const match = /^([01][0-9]|2[0-3]):([0-5][0-9])$/.exec(timeText);
        if (!match)
            throw new Error('Usa minutos o una hora válida en formato HH:MM.');

        const target = new Date();
        target.setHours(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10), 0, 0);
        if (target.getTime() <= Date.now())
            target.setDate(target.getDate() + 1);

        return Math.floor(target.getTime() / 1000);
    }

    _emitChanged() {
        if (this._changedCallback)
            this._changedCallback();
    }
}
