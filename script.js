// Definiim els llits
const llits = [
  "310A", "310B", "311A", "311B", "312A", "312B",
  "313A", "313B", "314A", "314B", "315A", "315B",
  "316A", "316B", "317A", "317B", "318A", "318B",
  "319A", "319B", "320A", "320B"
];

const planta = document.getElementById("planta");
const popup = document.getElementById("popup");
const tancarBtn = document.getElementById("tancar-popup");
const formulari = document.getElementById("formulari-pacient");
let llitActual = "";

// Exploracionc complementàries disponibles
const EXPLORACIONS = [
  "rx", "eeg", "rmn", "tac", "eco", "analiticageneral", "analisisang", "urina",
  "urina24h", "urinocultiu", "femta", "hemocultiu", "mostrarespiratoria", "gammagrafia", "sedacio"
];

// Funció que genera formulari d'exploracions
function generarFormulariExploracions(dades = {}) {
  const container = document.getElementById("exploracions-container");
  console.log(container);
  container.innerHTML = "";

  EXPLORACIONS.forEach(nom => {
    const bloc = document.createElement("div");
    bloc.className = "exploracio-bloc";

    const checked = dades.exploracions?.[nom]?.actiu ? "checked" : "";
    const estat = dades.exploracions?.[nom]?.estat || "pendent";
    const sedacio = dades.exploracions?.[nom]?.sedacio ? "checked" : "";
    const data = dades.exploracions?.[nom]?.data || "";

    bloc.innerHTML = `
      <label><input type="checkbox" name="expl-${nom}" ${checked}> ${nom.toUpperCase()}</label>
      <select name="estat-${nom}">
        <option value="pendent" ${estat === "pendent" ? "selected" : ""}>pendent</option>
        <option value="realitzada" ${estat === "realitzada" ? "selected" : ""}>realitzada</option>
      </select>
      <label><input type="checkbox" name="sedacio-${nom}" ${sedacio}> sedació</label>
      <input type="datetime-local" name="data-${nom}" value="${data}">
    `;

    container.appendChild(bloc);
  });
}

// Funció per obtenir les habitacions disponibles
// (sense pacients assignats i sense bloqueigs)
function obtenirHabitacionsDisponibles() {
  return llits.filter(llit => {
    const ocupat = localStorage.getItem(`pacient-${llit}`);
    return !ocupat && !habitacioEsBloquejada(llit);
  });
}

// Crear les caixetes de llits
llits.forEach((habitacio) => {
  const div = document.createElement("div");
  div.className = "llit";

  const dadesGuardades = JSON.parse(localStorage.getItem(`pacient-${habitacio}`));
  let html = `<strong>${habitacio}</strong>`;
  let iconsHTML = "";

  if (dadesGuardades?.nom && dadesGuardades?.edat && dadesGuardades?.sexe) {
    html += `<br/>${dadesGuardades.nom}, ${dadesGuardades.edat}, ${dadesGuardades.sexe}`;
  }

  if (dadesGuardades?.alertes) {
    dadesGuardades.alertes.forEach(alerta => {
      let title = alerta;
      if (alerta === "aillament") {
        title = `Aïllament: ${dadesGuardades.aillament_tipus || ""} - ${dadesGuardades.aillament_responsable || ""}`;
      } else if (alerta === "deju") {
        title = `Dejuni a partir de les ${dadesGuardades.deju_hora || "--:--"}`;
      }
      iconsHTML += `<img class="alerta-icon" src="img/${alerta}.png" alt="${alerta}" title="${title}">`;
    });
  }

  if (iconsHTML) {
    html += `<div class="alertes-container">${iconsHTML}</div>`;
  }

  div.innerHTML = html;

  // Obrir el formulari en fer click
  div.addEventListener("click", () => {
    llitActual = habitacio;
    const dades = JSON.parse(localStorage.getItem(`pacient-${llitActual}`));

    const titol = (dades?.nom && dades?.edat && dades?.sexe)
      ? `${llitActual} - ${dades.nom}, ${dades.edat}, ${dades.sexe}`
      : `${llitActual} - Habitació buida`;

    document.getElementById("titol-popup").textContent = titol;

    popup.classList.remove("hidden");
    carregarDades();
  });

  planta.appendChild(div);
});

// Tancar el popup
tancarBtn.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Guardar les dades del formulari a localStorage
formulari.addEventListener("submit", (e) => {
  e.preventDefault();

  const dades = {};

  dades.nom = formulari.elements["nom"].value;
  dades.edat_valor = formulari.elements["edat_valor"].value;
  dades.edat_unitat = formulari.elements["edat_unitat"].value;
  dades.sexe = formulari.elements["sexe"].value;

  if (!dades.nom || !dades.edat_valor || !dades.edat_unitat || !dades.sexe) {
    alert("Cal omplir nom, edat i sexe.");
    return;
  }

  dades.edat = `${dades.edat_valor} ${dades.edat_unitat}`;
  delete dades.edat_valor;
  delete dades.edat_unitat;

  dades.alertes = [];
  document.querySelectorAll('input[name="alertes"]:checked').forEach(cb => {
    dades.alertes.push(cb.value);
  });

  if (dades.alertes.includes("aillament")) {
    dades.aillament_tipus = formulari.elements["aillament_tipus"].value || "";
    dades.aillament_responsable = formulari.elements["aillament_responsable"].value || "";
  }

  if (dades.alertes.includes("deju")) {
    dades.deju_hora = formulari.elements["deju_hora"].value || "";
  }

  if (!dades.nom || !dades.edat_valor || !dades.edat_unitat || !dades.sexe) {
    alert("Cal omplir nom, edat i sexe.");
    return;
  }

  dades.edat = `${dades.edat_valor} ${dades.edat_unitat}`;
  delete dades.edat_valor;
  delete dades.edat_unitat;

  // Alertes
  dades.alertes = [];
  document.querySelectorAll('input[name="alertes"]:checked').forEach(cb => {
    dades.alertes.push(cb.value);
  });
  // Recollir exploracions acceptades
  dades.exploracions = [];
  document.querySelectorAll(".exploracio-bloc").forEach(bloc => {
    if (bloc.dataset.acceptat === "true") {
      dades.exploracions.push({
        nom: bloc.dataset.nom,
        estat: bloc.dataset.estat,
        sedacio: bloc.dataset.sedacio === "true",
        data: bloc.dataset.data
      });
    } 
  });
  //Guarda les dades a localStorage
  localStorage.setItem(`pacient-${llitActual}`, JSON.stringify(dades));
  actualitzarCaixeta(llitActual, dades);
  aplicarBloqueigsContigus();

  // Actualitza títol
  const titolActualitzat = `${llitActual} - ${dades.nom}, ${dades.edat}, ${dades.sexe}`;
  document.getElementById("titol-popup").textContent = titolActualitzat;

  // Tanca el popup
  popup.classList.add("hidden");
  console.log("Dades guardades:", dades);
});

// Funció per saber si una habitació, o la del seu costat, està bloquejada (per aïllament o bloqueig)
function habitacioEsBloquejada(llit) {
  const dades = JSON.parse(localStorage.getItem(`pacient-${llit}`));
  const costat = obtenirLlitCostat(llit);
  const dadesCostat = costat ? JSON.parse(localStorage.getItem(`pacient-${costat}`)) : null;

  const bloquejada = dades?.alertes?.includes("aillament") || dades?.alertes?.includes("bloqueig");
  const costatBloquejat = dadesCostat?.alertes?.includes("aillament") || dadesCostat?.alertes?.includes("bloqueig");

  return bloquejada || costatBloquejat;
}

// Funció per afegir un formulari d'exploració nou
function afegirExploracioForm(dades = {}) {
  const container = document.getElementById("formulari-exploracions");
  const index = container.children.length;

  const div = document.createElement("div");
  div.classList.add("exploracio-bloc");

  div.innerHTML = `
    <select name="expl-nom-${index}">
      <option value="">-- Escull exploració --</option>
      <option value="rx">Radiografia (RX)</option>
      <option value="eeg">Electroencefalograma (EEG)</option>
      <option value="rmn">Ressonància magnètica nuclear (RMN)</option>
      <option value="tac">Tomografia axial computada (TAC)</option>
      <option value="eco">Ecografia (ECO)</option>
      <option value="analiticageneral">Analítica general (AG)</option>
      <option value="analisisang">Anàlisi de sang</option>
      <option value="urina">Analítica d'orina</option>
      <option value="urina24h">Orina 24 hores</option>
      <option value="urinocultiu">Urinocultiu</option>
      <option value="femta">Recollida de femta</option>
      <option value="hemocultiu">Hemocultiu</option>
      <option value="mostrarespiratoria">Mostra respiratòria</option>
      <option value="gammagrafia">Gammagrafia</option>
      <option value="sedacio">Sedació</option>
    </select>
    <select name="expl-estat-${index}">
      <option value="pendent">Pendent</option>
      <option value="realitzada">Realitzada</option>
    </select>
    <label><input type="checkbox" name="expl-sedacio-${index}"> Sedació</label>
    <input type="datetime-local" name="expl-data-${index}">
    <button type="button" onclick="acceptarExploracio(this)">✔ Acceptar</button>
  `;

  // Si es passen dades per editar, les afegim
  if (dades.nom) div.querySelector(`[name="expl-nom-${index}"]`).value = dades.nom;
  if (dades.estat) div.querySelector(`[name="expl-estat-${index}"]`).value = dades.estat;
  if (dades.sedacio) div.querySelector(`[name="expl-sedacio-${index}"]`).checked = true;
  if (dades.data) div.querySelector(`[name="expl-data-${index}"]`).value = dades.data;

  container.appendChild(div);
}

// Funció per carregar les dades del pacient al formulari
function carregarDades() {
  formulari.reset(); // Esborrem tot 
  const dades = JSON.parse(localStorage.getItem(`pacient-${llitActual}`)) || {};
  document.getElementById("formulari-exploracions").innerHTML = "";
  if (Array.isArray(dades.exploracions)) {
    dades.exploracions.forEach(exp => afegirExploracioForm(exp));
  }

  for (const [clau, valor] of Object.entries(dades)) {
    const input = formulari.elements[clau];

    // Cas especial: Edat en format anys, mesos, dies
    if (clau === "edat" && typeof valor === "string") {
      const [valorNum, unitat] = valor.split(" ");
      if (formulari.elements["edat_valor"]) {
        formulari.elements["edat_valor"].value = valorNum;
      }
      if (formulari.elements["edat_unitat"]) {
        formulari.elements["edat_unitat"].value = unitat;
      }
      continue; 
    }

    if (!input) continue;

    // Casos especials
    if (input instanceof RadioNodeList) {
      //  Radio buttons
      const radio = formulari.querySelector(`[name="${clau}"][value="${valor}"]`);
      if (radio) radio.checked = true;
    } else if (input.type === "checkbox" && input.name === "alertes") {
      // Checkboxes per alertes
      if (Array.isArray(dades.alertes)) {
        input.checked = dades.alertes.includes(input.value);
        const sub = document.querySelector(`.alerta-subcamp[data-alerta="${input.value}"]`);
        if (sub) sub.style.display = input.checked ? "block" : "none";
      } else {
        input.checked = !!valor;
      }
    } else if (input.type === "checkbox" && input.name === "exploracio_nom") {
        input.checked = Array.isArray(dades.exploracio_nom) && dades.exploracio_nom.includes(input.value);
    } else {
      // Camps de text, número, data...
      input.value = valor;
    }
  }
  const selectReubicar = document.getElementById("reubicar_a");
  if (selectReubicar) {
    selectReubicar.innerHTML = `<option value="">-- escull habitació lliure --</option>`;
    obtenirHabitacionsDisponibles().forEach(llit => {
      const opt = document.createElement("option");
      opt.value = llit;
      opt.textContent = llit;
      selectReubicar.appendChild(opt);
    });
  }
  generarFormulariExploracions(dades);
}

// Funció per reubicar un pacient a una nova habitació (esborrant les dades de l'habitació d'abans)
function reubicarPacientA(habitacioNova) {
  const dades = JSON.parse(localStorage.getItem(`pacient-${llitActual}`));
  if (!dades || !habitacioNova || habitacioNova === llitActual) return;

  // Assignar dades a la nova habitació
  localStorage.setItem(`pacient-${habitacioNova}`, JSON.stringify(dades));
  actualitzarCaixeta(habitacioNova, dades);

  // Esborrar pacient de l'habitació actual
  localStorage.removeItem(`pacient-${llitActual}`);
  actualitzarCaixeta(llitActual, {});

  // Actualitzar bloquejos
  aplicarBloqueigsContigus();

  // Actualitzar titol i llit actual
  document.getElementById("titol-popup").textContent = `${habitacioNova} - ${dades.nom}, ${dades.edat}, ${dades.sexe}`;
  llitActual = habitacioNova;
}

// Funció per obtenir el llit del costat 
function obtenirLlitCostat(nomLlit) {
  // Ex: "310A" → prefix: "310", sufix: "A"
  const prefix = nomLlit.slice(0, -1);
  const sufix = nomLlit.slice(-1);

  if (sufix === "A") return prefix + "B";
  if (sufix === "B") return prefix + "A";
  return null; 
}

// Funció per actualitzar la caixeta d'un llit amb les dades del pacient
function actualitzarCaixeta(habitacio, dades) {
  const caixeta = [...document.querySelectorAll(".llit")]
    .find(div => div.textContent.includes(habitacio));

  if (caixeta) {
    const nom = dades.nom || "";
    const edat = dades.edat || "";
    const sexe = dades.sexe || "";

    let html = `<strong>${habitacio}</strong>`;

    if (nom && edat && sexe) {
      html += `<br/>${nom}, ${dades.edat || ""}, ${sexe}`;
    }

    let iconsHTML = "";

    if (dades.alertes) {
      dades.alertes.forEach(alerta => {
        let title = alerta;

        if (alerta === "aillament") {
          title = `Aïllament: ${dades.aillament_tipus || ""} - ${dades.aillament_responsable || ""}`;
        } else if (alerta === "deju") {
          title = `Dejuni a partir de les ${dades.deju_hora || "--:--"}`;
        }

        iconsHTML += `<img class="alerta-icon" src="img/${alerta}.png" alt="${alerta}" title="${title}">`;
      });
    }
    if (Array.isArray(dades.exploracions)) {
      dades.exploracions.forEach(exp => {
        if (exp.nom) {
          const title = `Exploració: ${exp.nom.toUpperCase()} - ${exp.estat} - ${exp.data || ''}`;
          iconsHTML += `<img class="alerta-icon" src="img/${exp.nom}.png" alt="${exp.nom}" title="${title}">`;
        }
      });
    }

    if (dades.alertes?.includes("aillament") || dades.alertes?.includes("bloqueig")) {
      const costat = obtenirLlitCostat(habitacio);
      if (costat) {
        const costatDiv = [...document.querySelectorAll(".llit")]
          .find(div => div.textContent.includes(costat));
        if (costatDiv) costatDiv.classList.add("bloquejat");
      }
    }

    if (iconsHTML) {
      html += `<div class="alertes-container">${iconsHTML}</div>`;
    }

    caixeta.innerHTML = html;
  }
}

const eliminarBtn = document.getElementById("eliminar-pacient");

// Funció per donar d'alta un pacient
eliminarBtn.addEventListener("click", () => {
  if (confirm("Segur que vols donar d'alta aquest pacient?")) {
    // Elimina el pacient del llit actual
    localStorage.removeItem(`pacient-${llitActual}`);
    actualitzarCaixeta(llitActual, {});
    // Torna a aplicar els bloquejos de tota la planta
    aplicarBloqueigsContigus();
    // Tanca el popup
    popup.classList.add("hidden");
  }
});

// Funció per mostrar o ocultar els subcamps de les alertes
const checkboxes = document.querySelectorAll('input[name="alertes"]');
checkboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const subcamp = document.querySelector(`.alerta-subcamp[data-alerta="${cb.value}"]`);
    if (subcamp) {
      subcamp.style.display = cb.checked ? "block" : "none";
    }
  });
});

// Mostra/amaga el panell
const toggleBtn = document.getElementById("toggle-panell");
const panell = document.getElementById("panell-lateral");
toggleBtn.addEventListener("click", () => {
  panell.classList.toggle("ocult");
});

// Funcions per gestionar les llistes d'ingressos, sortides, canvis de llit i futurs ingressos
function guardarLlista(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

// Funció per carregar una llista de localStorage
function carregarLlista(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Funció per generar una llista a la pàgina
function renderLlista(id, key) {
  const llista = document.getElementById(id);
  llista.innerHTML = "";
  const elements = carregarLlista(key);

  elements.forEach((obj, i) => {
    const li = document.createElement("li");
    const text = typeof obj === "string"
      ? obj  // Per ingressos, sortides, canvis que són simples strings
      : `${obj.data} - ${obj.nom} (${obj.edat}) - ${obj.diagnostic}`; // Només futurs
    li.textContent = text;

    // Botó X per eliminar
    const btnX = document.createElement("button");
    btnX.textContent = "X";
    btnX.className = "boto-esborrar";
    btnX.onclick = () => {
      esborrarElement(key, i, id);
    };
    li.appendChild(btnX);

    // Només mostrar "Ubicar a..." per futurs ingressos
    if (key === "futurs") {
      const select = document.createElement("select");
      select.innerHTML = "<option disabled selected>Ubicar a...</option>";
      obtenirHabitacionsDisponibles().forEach(llit => {
        const opt = document.createElement("option");
        opt.value = llit;
        opt.textContent = llit;
        select.appendChild(opt);
      });
      select.onchange = () => {
        const habitacio = select.value;
        const pacient = {
          nom: obj.nom,
          edat: obj.edat,
          sexe: "---",
          diagnostic: obj.diagnostic,
          inf_assignada: "",
          especialitat: "",
          alta_prevista: "",
          informe_alta: "",
          permis_sortida: "",
          exploracions: [],
          intervencio_nom: "",
          intervencio_estat: "",
          intervencio_sedacio: false,
          intervencio_data: "",
          alertes: [],
          observacions: ""
        };

        //Desa el pacient
        localStorage.setItem(`pacient-${habitacio}`, JSON.stringify(pacient));

        //Actualitza caixeta i el titol
        actualitzarCaixeta(habitacio, pacient);
        aplicarBloqueigsContigus();

        //Obre popup i carrega dades
        llitActual = habitacio;
        document.getElementById("titol-popup").textContent = `${habitacio} - ${pacient.nom}, ${pacient.edat}, ${pacient.sexe}`;
        carregarDades();
        popup.classList.remove("hidden");

        // Elimina de la llista de futurs
        esborrarElement(key, i, id);
      };
      li.appendChild(select);
    }

    llista.appendChild(li);
  });
}

// Funció per esborrar un element de la llista i actualitzar
function esborrarElement(key, index, id) {
  const arr = carregarLlista(key);
  arr.splice(index, 1);
  guardarLlista(key, arr);
  renderLlista(id, key);
}

// Funcions per afegir dades a les llistes (afegirIngress)
function afegirIngress() {
  const procedencia = document.getElementById("procedencia").value;
  const estat = document.getElementById("estat_ingres").value;
  const item = `${procedencia} - ${estat}`;
  const clau = "ingressos";
  const arr = carregarLlista(clau);
  arr.push(item);
  guardarLlista(clau, arr);
  renderLlista("llista-ingressos", clau);
}

// Funció per afegir un futur ingrés
function afegirFuturIngres() {
  const data = document.getElementById("futur_data").value;
  const nom = document.getElementById("futur_nom").value;
  const edatVal = document.getElementById("futur_edat_valor").value;
  const edatUnitat = document.getElementById("futur_edat_unitat").value;
  const diagnostic = document.getElementById("futur_diagnostic").value;

  if (!data || !nom || !edatVal || !edatUnitat || !diagnostic) {
    alert("Cal omplir tots els camps.");
    return;
  }

  const edat = `${edatVal} ${edatUnitat}`;
  const text = `${data} - ${nom} (${edat}) - ${diagnostic}`;

  const clau = "futurs";
  const arr = carregarLlista(clau);
  arr.push({ data, nom, edat, diagnostic });
  guardarLlista(clau, arr);
  renderLlista("llista-futurs", clau);

  // Netejar camps
  document.getElementById("futur_data").value = "";
  document.getElementById("futur_nom").value = "";
  document.getElementById("futur_edat_valor").value = "";
  document.getElementById("futur_edat_unitat").value = "anys";
  document.getElementById("futur_diagnostic").value = "";
}

// Funció per afegir un canvi de llit
function afegirCanviLlit() {
  const text = document.getElementById("canvi_llit_text").value.trim();
  if (text) {
    const clau = "canvis";
    const arr = carregarLlista(clau);
    arr.push(text);
    guardarLlista(clau, arr);
    renderLlista("llista-canvis-llit", clau);
    document.getElementById("canvi_llit_text").value = "";
  }
}

// Funció per afegir una sortida
function afegirSortida() {
  const desti = document.getElementById("sortida_desti").value;
  const trasllat = document.getElementById("sortida_trasllat").value;

  if (!desti || !trasllat) {
    alert("Cal omplir els dos camps.");
    return;
  }

  const item = `${desti} - ${trasllat}`;
  const clau = "sortides";
  const arr = carregarLlista(clau);
  arr.push(item);
  guardarLlista(clau, arr);
  renderLlista("llista-sortides", clau);

  document.getElementById("sortida_desti").value = "";
  document.getElementById("sortida_trasllat").value = "";
}

// Mostrar/amagar el panell dret
const toggleDret = document.getElementById("toggle-dret");
const panellDret = document.getElementById("panell-dret");
toggleDret.addEventListener("click", () => {
  panellDret.classList.toggle("ocult");
});

// Funcions per gestionar les llistes de la dreta
function guardarLlistaDret(key, array) {
  localStorage.setItem(key, JSON.stringify(array));
}

function carregarLlistaDret(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Funció per generar una llista a la dreta
function renderLlistaDret(id, key) {
  const llista = document.getElementById(id);
  llista.innerHTML = "";
  const elements = carregarLlistaDret(key);
  elements.forEach((text, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${text} <button class="boto-esborrar" onclick="esborrarElementDret('${key}', ${i}, '${id}')">X</button>`;
    llista.appendChild(li);
  });
}

// Funció per esborrar un element de la llista dreta i actualitzar
function esborrarElementDret(key, index, id) {
  const arr = carregarLlistaDret(key);
  arr.splice(index, 1);
  guardarLlistaDret(key, arr);
  renderLlistaDret(id, key);
}

// Funcions per afegir canvis a les llistes de la dreta
// Funció per afegir un apòsit
function afegirAposits() {
  const text = document.getElementById("aposits_input").value.trim();
  if (text) {
    const clau = "aposits";
    const arr = carregarLlistaDret(clau);
    arr.push(text);
    guardarLlistaDret(clau, arr);
    renderLlistaDret("llista-aposits", clau);
    document.getElementById("aposits_input").value = "";
  }
}

// Funció per afegir una interconsulta
function afegirInterconsulta() {
  const text = document.getElementById("interconsulta_input").value.trim();
  if (text) {
    const clau = "interconsulta";
    const arr = carregarLlistaDret(clau);
    arr.push(text);
    guardarLlistaDret(clau, arr);
    renderLlistaDret("llista-interconsulta", clau);
    document.getElementById("interconsulta_input").value = "";
  }
}

// Funció per afegir una fisioteràpia
function afegirFisio() {
  const text = document.getElementById("fisio_input").value.trim();
  if (text) {
    const clau = "fisio";
    const arr = carregarLlistaDret(clau);
    arr.push(text);
    guardarLlistaDret(clau, arr);
    renderLlistaDret("llista-fisio", clau);
    document.getElementById("fisio_input").value = "";
  }
}

// Funció per afegir una sessió de psicologia
function afegirPsico() {
  const text = document.getElementById("psico_input").value.trim();
  if (text) {
    const clau = "psico";
    const arr = carregarLlistaDret(clau);
    arr.push(text);
    guardarLlistaDret(clau, arr);
    renderLlistaDret("llista-psico", clau);
    document.getElementById("psico_input").value = "";
  }
}

// Carrega les dades en carregar la pàgina
window.addEventListener("DOMContentLoaded", () => {
  renderLlista("llista-ingressos", "ingressos");
  renderLlista("llista-futurs", "futurs");
  renderLlista("llista-canvis-llit", "canvis");
  renderLlista("llista-sortides", "sortides");

  renderLlistaDret("llista-aposits", "aposits");
  renderLlistaDret("llista-interconsulta", "interconsulta");
  renderLlistaDret("llista-fisio", "fisio");
  renderLlistaDret("llista-psico", "psico");


  aplicarBloqueigsContigus();
});

// Funció per aplicar bloqueigs als llits contigus de pacients amb aïllament o bloqueig
function aplicarBloqueigsContigus() {
  document.querySelectorAll(".llit").forEach(div => div.classList.remove("bloquejat"));

  llits.forEach((habitacio) => {
    const dades = JSON.parse(localStorage.getItem(`pacient-${habitacio}`));
    if (dades?.alertes?.includes("aillament") || dades?.alertes?.includes("bloqueig")) {
      const costat = obtenirLlitCostat(habitacio);
      if (costat) {
        const costatDiv = [...document.querySelectorAll(".llit")]
          .find(div => div.textContent.includes(costat));
        if (costatDiv) costatDiv.classList.add("bloquejat");
      }
    }
  });
}

// Funció per mostrar/ocultar formularis
function toggleFormulari(id) {
  const div = document.getElementById(id);
  div.style.display = (div.style.display === "none") ? "block" : "none";
}

// Funció per mostrar el formulari de reubicació
document.getElementById("btn-reubicar").addEventListener("click", () => {
  const select = document.getElementById("reubicar_a");
  const habitacioNova = select.value;

  if (!habitacioNova) {
    alert("Cal seleccionar una habitació per reubicar el pacient.");
    return;
  }

  reubicarPacientA(habitacioNova);
  popup.classList.add("hidden"); // tancar el popup un cop reubicat
});
