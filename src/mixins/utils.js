export function afterOneHour(codeToExecute) {
  return setTimeout(codeToExecute, 3600000); // 1 hour in milliseconds
}

export function modeTestToggle() {
  sessionStorage.setItem('mode-test', sessionStorage.getItem('mode-test') !== 'false' ? 'false' : 'true')
  console.log('Mode test:', sessionStorage.getItem('mode-test'));
  setTimeout(() => {
    document.location.reload();
  }, 100)
}
export function modeTestOn() {
  return sessionStorage.getItem('mode-test') === 'true';
}
// Convertir une date au format iCalendar
function formatDateToICS(date) {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
export function brevoOpen() {
  BrevoConversations('openChat', true);
}
// Générer le contenu du fichier ICS
export function generateICS(eventName, eventSlug, eventDate, endDate = false) {
  const formattedStartDate = formatDateToICS(eventDate);

  // Gérer la date de fin
  let formattedEndDate;
  if (endDate) {
    formattedEndDate = formatDateToICS(endDate);
  } else {
    const defaultEndDate = new Date(new Date(eventDate).getTime() + 30 * 60000); // 30 minutes plus tard
    formattedEndDate = formatDateToICS(defaultEndDate);
  }

  const content = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${formattedStartDate}\r\nDTEND:${formattedEndDate}\r\nLOCATION:7, avenue de Blida, 57000 Metz\r\nSUMMARY:${eventName}\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

  // Créer un blob à partir du contenu
  const blob = new Blob([content], { type: "text/calendar" });

  // Créer une URL pour le blob
  const url = URL.createObjectURL(blob);

  // Créer un élément <a> pour déclencher le téléchargement
  const a = document.createElement("a");
  a.href = url;
  a.download = `${eventSlug}.ics`;

  // Ajouter l'élément à la page et cliquer dessus
  document.body.appendChild(a);
  a.click();

  // Nettoyer
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Utilisation de la fonction

export function joinFrench(array) {
  if (array.length === 0) return "";
  if (array.length === 1) return array[0];

  const initialElements = array.slice(0, -1).join(", ");
  const lastElement = array.slice(-1);
  return `${initialElements} et ${lastElement}`;
}
