# Notificaciones programadas

Extensión para GNOME Shell 50 que permite programar recordatorios desde el panel. El tiempo puede escribirse como una cantidad de minutos (`20`) o como una hora concreta (`15:20`).

## Estado

El proyecto está en desarrollo y todavía no fue enviado a extensions.gnome.org.

## Construcción

```bash
make pack
```

El paquete se genera en `dist/notificaciones@dejotaerre.github.io.shell-extension.zip`.

## Instalación local

```bash
make install
gnome-extensions enable notificaciones@dejotaerre.github.io
```

En Wayland, los cambios pueden probarse en una sesión anidada mediante `gnome-shell-test-tool` o cerrando y volviendo a iniciar sesión.

## Publicación en EGO

Antes de publicar, el mantenedor debe leer y comprender todo el código, probarlo en GNOME Shell 50 y retirar personalmente el aviso de código asistido por IA de `extension.js`. Publicar en extensions.gnome.org implica asumir el mantenimiento de la extensión.

## Licencia

GPL-3.0-or-later.
