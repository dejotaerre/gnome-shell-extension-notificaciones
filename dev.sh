#!/usr/bin/env bash

set -euo pipefail

readonly UUID="notificaciones@dejotaerre.github.io"
readonly PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_DIR"
make install

printf 'Iniciando GNOME Shell de prueba...\n'
printf 'Cierra la ventana anidada para terminar.\n'

# La sesión principal fuerza X11 para GTK, pero mutter-devkit debe usar Wayland.
export GDK_BACKEND=wayland

dbus-run-session -- bash -c '
set -euo pipefail

uuid="$1"
gnome-shell --devkit --wayland &
shell_pid=$!

cleanup() {
    if kill -0 "$shell_pid" 2>/dev/null; then
        kill "$shell_pid"
    fi
    wait "$shell_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

for _attempt in {1..50}; do
    if gnome-extensions info "$uuid" >/dev/null 2>&1; then
        gnome-extensions enable "$uuid"
        printf "Extensión habilitada en el GNOME anidado.\n"
        wait "$shell_pid"
        exit 0
    fi

    if ! kill -0 "$shell_pid" 2>/dev/null; then
        wait "$shell_pid"
        exit $?
    fi

    sleep 0.2
done

printf "No se pudo habilitar %s en el GNOME anidado.\n" "$uuid" >&2
exit 1
' bash "$UUID"
