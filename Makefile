UUID := notificaciones@dejotaerre.github.io
DIST := dist/$(UUID).shell-extension.zip
INSTALL_DIR := $(HOME)/.local/share/gnome-shell/extensions/$(UUID)

.PHONY: all pack install enable disable dev clean

all: pack

pack:
	mkdir -p dist
	gnome-extensions pack --force --out-dir=dist \
		--schema=schemas/org.gnome.shell.extensions.notificaciones.gschema.xml \
		--extra-source=alarmManager.js \
		--extra-source=indicator.js \
		--extra-source=notifier.js \
		--extra-source=LICENSE \
		--extra-source=icons .

install: pack
	mkdir -p $(INSTALL_DIR)
	unzip -oq $(DIST) -d $(INSTALL_DIR)
	test -f $(INSTALL_DIR)/notifier.js

enable:
	gnome-extensions enable $(UUID)

disable:
	gnome-extensions disable $(UUID)

dev:
	./dev.sh

clean:
	rm -f $(DIST)
