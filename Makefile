UUID := notificaciones@dejotaerre.github.io
DIST := dist/$(UUID).shell-extension.zip

.PHONY: all pack install enable disable clean

all: pack

pack:
	mkdir -p dist
	gnome-extensions pack --force --out-dir=dist \
		--schema=schemas/org.gnome.shell.extensions.notificaciones.gschema.xml \
		--extra-source=alarmManager.js \
		--extra-source=indicator.js \
		--extra-source=LICENSE \
		--extra-source=icons .

install: pack
	gnome-extensions install --force $(DIST)

enable:
	gnome-extensions enable $(UUID)

disable:
	gnome-extensions disable $(UUID)

clean:
	rm -f $(DIST)
