# Pissarra digital de la planta de pediatria

## Propòsit del projecte

La pissarra digital dissenyada mostra la situació actual de la planta de pediatria de l'Hospital Universitari Dr. Josep Trueta. En ella s'hi mostra l'estat dels 22 llits disponibles i funciona com a punt comú i centralitzat de consulta i introducció d'informació pels diferents professionals sanitaris. Gràcies a la implementació d'aquesta eina aconseguirem:

    •	Disminuir el nombre d’interrupcions innecessàries entre professionals durant l’activitat assistencial.
    •	Agilitzar els canvis de torn.
    •	Reduir els incidents de seguretat relacionats amb errors de comunicació.
    •	Millorar el traspàs d’informació


## Manual d'instal·lació

Per tal d'instal·lar el projecte només cal disposar d'un navegador web.

Els passos necessaris que s'han de seguir per instal·lar-lo són els següents:

    1. Descarregar el projecte: baixar o clonar el repositori des de GitHub.
    2. Comprovar que la carpeta conté:
        index.html
        style.css
        script.js
        carpeta img/ amb les icones
    3. A la carpeta descarregada, fer doble clic al fitxer index.html.
    4. L'aplicació s'obrirà automàticament al navegador. 


## Manual d'usuari 

La pissarra digital consta de quatre àrees principals:
    - Vista general dels llits: A cada un es mostra el nom, l’edat, el sexe, les alertes actives i les exploracions complementàries per aquell pacient. 
    - Pantalla emergent amb informació detallada del pacient, la qual podem consultar i modificar.
    - Panell lateral esquerra: Permet gestionar el flux de pacients (ingressos, altes, canvis de llit).
    - Panell lateral dret: Mostra els serveis i les tasques específiques que s'han de fer a cada habitació.

Les accions principals que permet la pantalla són
•	Registrar un nou pacient: 
        1.	L’administrativa introdueix el pacient a la secció “Futurs ingressos”.
        2.	La infermera assigna aquell pacient a un dels llits disponibles de la planta i completa les dades: sexe, infermera assignada, especialitat... i activa les alarmes que siguin necessàries
•	Donar d’alta a un pacient
        1.	La infermera marca les caselles: informe d’alta realitzat i permís de sortida, i activa l’alerta de neteja.
        2.	La infermera registra el destí i el mitjà de transport a la secció “Sortides”.
        3.	L’administrativa gestiona el transport i elimina la sortida una vegada el pacient ha marxat.
        4.	Quan l’habitació ha estat netejada i està disponible per l’entrada d’un nou pacient, es dona l’alta a la pantalla.
•	Reubicar pacients: Es poden reubicar pacients a altres llits segons les necessitats assistencial o, per exemple, durant la reunió INF-MET. Per fer-ho, a la pantalla emergent del pacient que es vulgui canviar de llit, hi ha la opció de reubicar, la qual desplega un formulari amb les habitacions disponibles de la planta. Al triar una de les habitacions tot la informació del pacient passa a la nova habitació i s'elimina de l'antiga
•	Alarmes: A la pantalla emergent es poden activar diferents alarmes que apareixen al llit del pacient corresponent.
•	Bloqueig automàtic de llits: Quan s’activa una alerta d’aïllament o de bloqueig, el llit del costat apareix marcat en color vermell i no apareix a la llista de llits disponibles.
•	Gestió de les exploracions complementàries: S’introdueix les dades relatives a l’exploració complementària (nom de l’exploració, estat, necessitat de sedació i data i hora de programació). Automàticament, al llit del pacient, apareix la icona de la prova pendent. Una vegada s’ha dut a terme l’exploració, es marca com a realitzada i la icona desapareix.
•	Al panell lateral dret es poden introduir les habitacions que s’hi han de dur a terme determinades tasques o serveis específics, com canvi d’apòsits, interconsultes, fisioteràpia i sessions psicologia.
•	Al panell lateral esquerra es pot gestionar el flux dels pacients a la planta, ja que conté informació sobre nous ingressos, possibles canvis de llit i sortides.


