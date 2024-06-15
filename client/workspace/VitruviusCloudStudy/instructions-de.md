# Vitruvius Cloud Nutzerstudy

Prototypische Entwicklung eines modernen Tools das die Nutzung des Vitruvius Frameworks emöglicht.
Git ähnlich: VSUM = Repo. Besteht aus mehrerern einzelnen Modelleen mit Konsistenzaufrechtserhaltungs-Regeln Verschiedene Viewtypes auf dieses Repo. View eines types werden ausgecheckt, Änderungen werden durchgeführt, Änderungen werden committed, vitruvius propagiert Änderungen durch das VSUM.
Danke für Ihre Teilnahme!

# Anleitung

1. Öffnen Sie mittels strg + shift + P die Befehls-Palette. Checken Sie mittels 'Fetch View'-Befehls sowohl 'persons', als auch die 'families' Sicht aus.
2. Sehen Sie sich die geöffneten Editoren an und vergewissern sich, dass es sich um zwei unterschiedliche Ansichten auf den selben Modellbestand handelt
3. Fügen Sie zum graphischen 'families' Modell eine Tochter hinzu: In der rechten oberen Ecke des Editors gibt es dafür eine Werkzeugpalette. Klicken Sie hier auf 'Add Daughter'. Im Anschluss klicken Sie im Editor an die Stelle, an der das neue Modellelement platziert werden soll.
4. Lokal können Sie nun Ihren Fortschritt mittels strg + S speichern
5. Committen Sie ihre Änderungen nun in das VSUM, in dem Sie mit strg + shift + P die Befehls-Palette öffnen und den Befehl 'Commit Changes auswählen
6. Wechseln sie nun zum Editor der 'persons'-Ansicht. Vergewissern Sie sich, dass die eben hinzugefügte Tochter in dieser Ansicht noch nicht zu sehen ist. Dafür ist ein explizites Update notwendig.
7. Wählen Sie über die Befehls-Palette (strg + shift + p) den Befehl 'Update View' aus und wählen 'persons' aus
8. Vergwissern Sie sich, dass Sie in einer neuen Datei (persons 1.persons) den neuen Modellzustand, also die neu hinzugefügte Tochter, sehen
9. Nennen Sie in dieser Ansicht die neue Tochter zu 'Johanna' um
10. Nutzen Sie strg + S um ihre Änderungen lokal zu speichern
11. Nutzen Sie den 'Commit View' Befehl aus der Befehls-Palette (str + shift + P) um die 'persons'-Ansicht in das VSUM zu committen.
12. Wechseln Sie zur 'families.notation' Datei. Vergewissern Sie sich, dass Sie die eben durchgeführte Änderung noch nicht sehen.
13. Wählen Sie über die Befehls-Palette (strg + shift + p) den Befehl 'Update View' aus und wählen 'families' aus
14. Vergwissern Sie sich, dass Sie in einer neuen Datei (families 1.notation) den neuen Modellzustand, also die Tochter mit Namen Johanna, sehen
15. Fin.