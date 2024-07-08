# Vitruvius Cloud Nutzerstudy

## Kontext

Das Vitruvius Framework ist die Implementierung des Vitruvius Ansatzes. Der Vitruvius Ansatz ist ein sichtenbasierter Modellierungsansatz. Genauer beschrieben ist er in <https://www.sciencedirect.com/science/article/pii/S0164121220302144>.

Aus dem Vitruvius Ansatz leitet sich für dieses Tool, Vitruvius Cloud, ein git-ähnlicher Workflow ab:
Das Vitruvius Virtual Single Underlying Model (VSUM) entspricht einem zentralen online Repository, das mehrere Modelle Enthält.
Für dieses Repository kann man sich für die lokale Arbeit vom VSUM abgeleitete Sichten auschecken.
Diese Stellen verschiedene Betrachtungsweisen bzw. Ausschnitte des VSUMs dar.
Auf diesen Sichten können NutzerInnen für sich lokal Änderungen durchführen.
Sollen diese Änderungen im VSUM persistiert werden, müssen NutzerInnen die Änderungen explizit committen. Das Vitruvius Framework verarbeitet diese Änderungen und wendet sie auf die betroffenen Modelle im VSUM an.

## Anleitung

Im Folgenden finden Sie die Schritt-für-Schritt-Anleitung für die von Ihnen zu erfüllende Aufgabe.

1. Öffnen Sie die Befehls-Palette (strg + shift + P oder 'View' > 'Command Palette'). Checken Sie mittels 'Fetch View'-Befehl die 'persons' View aus. Dieser Befehl schreibt die Datei 'persons.persons' in Ihren Workspace und öffnet diese auch.
    Die Datei sollte im Baum Editor angezeigt werden. Sollte es bei der Darstellung der Datei Probleme geben, schließen Sie die Datei und öffnen sie wieder
2. Checken Sie, wie in 1., die 'families' View aus. Dieser Befehl schreibt 2 Dateien in Ihren workspace: 'families.families. und 'families.notation'.
    'families.families' ist das eigentliche semantische Modell und 'families.notation' die zugehörige grafische Darstellung. Der Befehl öffnet 'families.notation'
3. Sehen Sie sich die geöffneten Dateien an und vergewissern Sie sich, dass es sich um zwei unterschiedliche Ansichten auf den selben Modellbestand handelt
4. Fügen Sie zum graphischen 'families.notation' Modell eine Tochter hinzu: In der rechten oberen Ecke des Editors gibt es dafür eine Werkzeugpalette.
    Klicken Sie hier auf 'Add Daughter'. Im Anschluss klicken Sie im Editor an die Stelle, an der das neue Modellelement platziert werden soll (In manchen Browsern könnte hierfür ein Doppelklick notwendig sein). 
5. Lokal können Sie nun Ihren Fortschritt mittels strg + S speichern
6. Committen Sie ihre Änderungen nun in das VSUM, in dem Sie mit strg + shift + P die Befehls-Palette öffnen und den Befehl 'Commit Changes auswählen
7. Wechseln sie nun zum Editor der 'persons'-Ansicht. Vergewissern Sie sich, dass die eben hinzugefügte Tochter in dieser Ansicht noch nicht zu sehen ist. Dafür ist ein explizites Update notwendig.
8. Wählen Sie über die Befehls-Palette (strg + shift + p) den Befehl 'Update View' aus und wählen 'persons' aus
9. Vergwissern Sie sich, dass Sie in einer neuen Datei (persons 1.persons) den neuen Modellzustand, also die neu hinzugefügte Tochter, sehen
10. Nennen Sie in dieser Ansicht die neue Tochter zu 'Johanna' um
11. Nutzen Sie strg + S um ihre Änderungen lokal zu speichern
12. Nutzen Sie den 'Commit View' Befehl aus der Befehls-Palette (str + shift + P) um die 'persons'-Ansicht in das VSUM zu committen.
13. Wechseln Sie zur 'families.notation' Datei. Vergewissern Sie sich, dass Sie die eben durchgeführte Änderung noch nicht sehen.
14. Wählen Sie über die Befehls-Palette (strg + shift + p) den Befehl 'Update View' aus und wählen 'families' aus
15. Aufgrund technischer Einschränkungen des Prototypens ist es notwendig, das Sie den Tab families.notation schließen und wieder öffnen müssen, damit sie die das Update der Ansicht sehen können. Nachdem Sie das getan haben, vergwissern Sie sich, dass Sie den neuen Modellzustand, also die Tochter mit Namen Johanna, sehen

Sie haben das Ende der Aufgabe erreicht. Kehren Sie nun zur Umfrage zurück!
