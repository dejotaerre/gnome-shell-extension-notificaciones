# Notificaciones programadas

Extensión para GNOME Shell 50 que permite programar recordatorios desde el panel. El tiempo puede escribirse como una cantidad de minutos (`20`) o como una hora concreta (`15:20`).

## Estado

Versión inicial compatible con GNOME Shell 50.

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

## Licencia

MIT.
