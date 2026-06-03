<?php
session_start();
require __DIR__ . '/config.php';

if (isset($_GET['logout'])) { $_SESSION = []; session_destroy(); header('Location: ./'); exit; }

$error = '';
$today = date('Y-m-d');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['pw'])) {
  $pw = (string)$_POST['pw'];
  $matched = false;
  if ($pw !== '' && hash_equals($ADMIN['pass'], $pw)) {
    $_SESSION['firma'] = $ADMIN['firma'];
    $_SESSION['admin'] = true;
    unset($_SESSION['bis']);
    $matched = true;
  } else {
    foreach ($FIRMEN as $f) {
      if ($pw !== '' && hash_equals($f['pass'], $pw)) {
        $matched = true;
        if ($today < $f['von']) { $error = 'Der Zugang ist noch nicht freigeschaltet. Gueltig ab ' . $f['von'] . '.'; }
        elseif ($today > $f['bis']) { $error = 'Der Zugang ist am ' . $f['bis'] . ' abgelaufen. Bitte wende dich an die Workshop Leitung.'; }
        else {
          $_SESSION['firma'] = $f['firma'];
          $_SESSION['admin'] = false;
          $_SESSION['bis'] = $f['bis'];
        }
        break;
      }
    }
    if (!$matched) { $error = 'Passwort nicht korrekt.'; }
  }
  if (!empty($_SESSION['firma'])) { header('Location: ./'); exit; }
}

$auth = !empty($_SESSION['firma']);

if (!$auth):
?><!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Zugang Vorab Fragebogen</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    background:#f6f8fb;color:#222;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px}
  .box{background:#fff;border:1px solid #dde3ec;border-radius:12px;max-width:420px;width:100%;padding:30px}
  .top{background:linear-gradient(135deg,#1F4E78,#2E5C8A);color:#fff;border-radius:10px;padding:20px;margin-bottom:22px}
  .top h1{font-size:1.25em;margin-bottom:4px}
  .top p{opacity:.9;font-size:.9em}
  label{display:block;font-weight:600;margin-bottom:6px;font-size:.95em}
  input[type=password]{width:100%;padding:12px;border:1px solid #dde3ec;border-radius:8px;font-size:1em;font-family:inherit}
  button{margin-top:16px;width:100%;background:#00B050;color:#fff;border:none;border-radius:8px;
    padding:13px;font-size:1em;font-weight:600;cursor:pointer;font-family:inherit}
  button:hover{background:#009545}
  .err{color:#C0392B;font-weight:600;margin-top:14px;font-size:.95em}
  .hint{color:#667;font-size:.85em;margin-top:18px;line-height:1.5}
</style>
</head>
<body>
  <div class="box">
    <div class="top">
      <h1>Vorab Fragebogen Konfliktmanagement</h1>
      <p>Premium Workshop &middot; geschuetzter Zugang</p>
    </div>
    <form method="post" action="./">
      <label for="pw">Zugangspasswort</label>
      <input type="password" id="pw" name="pw" autofocus autocomplete="off">
      <button type="submit">Zugang oeffnen</button>
      <?php if ($error): ?><p class="err"><?php echo htmlspecialchars($error, ENT_QUOTES); ?></p><?php endif; ?>
    </form>
    <p class="hint">Das Passwort erhaeltst du von deiner Geschaeftsfuehrung. Es ist nur fuer einen
    festgelegten Zeitraum gueltig.</p>
  </div>
</body>
</html>
<?php
exit;
endif;

$FIRMA     = htmlspecialchars($_SESSION['firma'], ENT_QUOTES);
$ADMINMODE = !empty($_SESSION['admin']);
$BIS       = isset($_SESSION['bis']) ? htmlspecialchars($_SESSION['bis'], ENT_QUOTES) : '';
?>
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Vorab Fragebogen Konfliktmanagement</title>
<style>
  :root{
    --blau:#1F4E78; --blau2:#2E5C8A; --lila:#5C3A5C; --gruen:#00B050;
    --gelb:#E8A400; --rot:#C0392B; --bg:#f6f8fb; --line:#dde3ec; --text:#222;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    line-height:1.55;color:var(--text);background:var(--bg)}
  .wrap{max-width:820px;margin:0 auto;padding:0 18px 60px}
  header{background:linear-gradient(135deg,var(--blau) 0%,var(--blau2) 100%);color:#fff;padding:38px 18px}
  header .inner{max-width:820px;margin:0 auto}
  header h1{font-size:1.7em;margin-bottom:6px}
  header p{opacity:.92;font-size:1.02em}
  .region{margin-top:18px;display:flex;gap:10px;align-items:center;font-size:.92em}
  .region label{cursor:pointer;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:20px}
  .region input{margin-right:6px}
  .card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:22px;margin-top:22px}
  h2{color:var(--blau);font-size:1.18em;margin-bottom:4px}
  .sub{color:#667;font-size:.9em;margin-bottom:14px}
  .field{margin:12px 0}
  .field label{display:block;font-weight:600;margin-bottom:5px;font-size:.95em}
  input[type=text],input[type=date],input[type=number]{width:100%;padding:10px;border:1px solid var(--line);
    border-radius:7px;font-size:1em;font-family:inherit}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .codebox{background:#eef4fb;border:1px solid #cfe0f2;border-radius:8px;padding:14px;margin-top:12px;
    display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}
  .codebox .val{font-size:1.5em;font-weight:700;color:var(--blau);letter-spacing:1px}
  .note{font-size:.85em;color:#667;margin-top:8px}
  .q{padding:16px 0;border-bottom:1px solid var(--line)}
  .q:last-child{border-bottom:none}
  .q .qt{font-weight:600;margin-bottom:10px}
  .q .qn{color:var(--lila);font-weight:700;margin-right:6px}
  .opts{display:flex;flex-direction:column;gap:7px}
  .opt{display:flex;align-items:center;gap:9px;padding:8px 11px;border:1px solid var(--line);
    border-radius:7px;cursor:pointer;font-size:.95em}
  .opt:hover{border-color:var(--blau2);background:#f9fbfe}
  .opt input{accent-color:var(--blau);width:17px;height:17px}
  .scale{display:flex;gap:7px;flex-wrap:wrap}
  .scale .opt{flex:1;min-width:118px;justify-content:flex-start}
  .scale .legend{font-size:.82em;color:#778;margin-bottom:8px}
  .consent{display:flex;gap:10px;align-items:flex-start;background:#fbfaf6;border:1px solid #ece4cf;
    border-radius:8px;padding:14px}
  .consent input{margin-top:4px;width:18px;height:18px;accent-color:var(--blau)}
  .btnrow{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
  button{font-family:inherit;font-size:1em;font-weight:600;border:none;border-radius:8px;
    padding:13px 22px;cursor:pointer}
  .primary{background:var(--gruen);color:#fff}
  .primary:hover{background:#009545}
  .ghost{background:#fff;color:var(--blau);border:1px solid var(--blau)}
  .ghost:hover{background:#eef4fb}
  .err{color:var(--rot);font-weight:600;margin-top:12px;display:none}
  .q.missing{border-left:4px solid var(--rot);padding-left:10px;background:#fdecea;border-radius:6px}
  .consent.missing{border-color:var(--rot);background:#fdecea}
  .locked{padding:10px;border:1px solid var(--line);border-radius:7px;background:#eef4fb;font-weight:600;color:var(--blau)}
  /* result */
  #result{display:none}
  .gesamt{text-align:center;padding:10px 0 4px}
  .lamp{display:inline-block;width:74px;height:74px;border-radius:50%;margin:6px auto}
  .ampelrow{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
  .ampelrow:last-child{border-bottom:none}
  .dot{width:30px;height:30px;border-radius:50%;flex-shrink:0;border:2px solid rgba(0,0,0,.08)}
  .ampelrow .meta{flex:1}
  .ampelrow .meta .name{font-weight:700;color:var(--blau)}
  .ampelrow .meta .idx{font-size:.85em;color:#667}
  .ampelrow .meta .txt{font-size:.92em;margin-top:3px}
  .diag{background:#f4f1f6;border-left:4px solid var(--lila);padding:12px 14px;border-radius:6px;
    margin-top:14px;font-size:.93em}
  .legend-foot{font-size:.82em;color:#778;margin-top:14px}
  footer{font-size:.8em;color:#778;margin-top:28px;padding-top:18px;border-top:1px solid var(--line)}
  footer h3{font-size:1em;color:var(--blau);margin:14px 0 4px}
  @media(max-width:560px){.grid2{grid-template-columns:1fr}.scale .opt{min-width:46%}}
  @media print{header .region,.btnrow,#form-actions{display:none}body{background:#fff}}
</style>
</head>
<body>
<div id="jsbanner" style="display:none;background:#C0392B;color:#fff;padding:10px 16px;font-size:.9em;text-align:center"></div>
<header>
  <div class="inner">
    <h1>Vorab Fragebogen Konfliktmanagement</h1>
    <p>Premium Workshop &middot; Phase 0 Diagnose &middot; vertraulich und ohne Namen &middot; <span style="opacity:.6">Build 5</span></p>
    <div class="region">
      <span>Rechtsraum:</span>
      <label><input type="radio" name="region" value="AT" checked onclick="setRegion('AT')">Oesterreich</label>
      <label><input type="radio" name="region" value="DE" onclick="setRegion('DE')">Deutschland</label>
    </div>
  </div>
</header>
<?php if ($ADMINMODE): ?>
<div style="background:#5C3A5C;color:#fff;padding:8px 16px;text-align:center;font-size:.9em">Vorschau Modus (Admin) &middot; <a href="?logout" style="color:#fff">abmelden</a></div>
<?php elseif ($BIS): ?>
<div style="background:#eef4fb;color:#1F4E78;padding:8px 16px;text-align:center;font-size:.9em">Zugang gueltig bis <?php echo $BIS; ?> &middot; <a href="?logout" style="color:#1F4E78">abmelden</a></div>
<?php endif; ?>

<div class="wrap">
  <form id="form" onsubmit="return false">

  <!-- Kopf -->
  <div class="card">
    <h2>1. Rahmen</h2>
    <p class="sub">Nur Unternehmen und Datum. Bitte keine Personennamen eintragen.</p>
    <div class="grid2">
      <div class="field"><label>Unternehmen</label>
        <div class="locked" id="firma"><?php echo $FIRMA; ?></div></div>
      <div class="field"><label>Datum</label><input type="date" id="datum"></div>
    </div>
  </div>

  <!-- Info -->
  <div class="card">
    <h2>2. Fuer dich als Information</h2>
    <p>Dieser kurze Fragebogen hilft uns, den Workshop auf eure tatsaechliche Situation zuzuschneiden.
    Es geht nicht um richtig oder falsch und nicht um eine Bewertung deiner Fuehrung. Antworte spontan
    und ehrlich, so wie es sich im Alltag anfuehlt. Dauer etwa 5 Minuten.</p>
    <p class="note">Deine Antworten dienen ausschliesslich als Arbeitsbasis und werden nicht an andere
    Teilnehmende oder Vorgesetzte weitergegeben.</p>
  </div>

  <!-- Code -->
  <div class="card">
    <h2>3. Dein persoenlicher Code</h2>
    <p class="sub">Damit deine Antworten vertraulich bleiben und beim Follow up nach 4 Wochen wiedererkannt
    werden, erzeugst du dir selbst einen Code nach fester Regel. Nur du kannst ihn reproduzieren.</p>
    <div class="grid2">
      <div class="field"><label>Erste 2 Buchstaben des Vornamens deiner Mutter</label>
        <input type="text" id="cm" maxlength="20" oninput="buildCode()" placeholder="z. B. Anna"></div>
      <div class="field"><label>Tag deines Geburtsdatums (1 bis 31)</label>
        <input type="number" id="cd" min="1" max="31" oninput="buildCode()" placeholder="z. B. 7"></div>
    </div>
    <div class="field"><label>Letzter Buchstabe deines eigenen Vornamens</label>
      <input type="text" id="cn" maxlength="20" oninput="buildCode()" placeholder="z. B. Gerhard"></div>
    <div class="codebox"><span>Dein Code:</span><span class="val" id="codeval">&ndash;</span></div>
    <p class="note">Diese drei Eingaben bleiben nur in deinem Browser, werden nicht gesendet und nicht
    gespeichert. Sichtbar und uebermittelt wird ausschliesslich der fertige Code (Beispiel: AN07D).</p>
  </div>

  <!-- Cluster A -->
  <div class="card" id="cardA">
    <h2>4. Konflikt Landkarte</h2>
    <p class="sub">Wo und wie stark wirkt eine Spannung gerade.</p>
    <div id="blockA"></div>
  </div>

  <!-- Cluster B -->
  <div class="card">
    <h2>5. Struktur und Rollen</h2>
    <p class="scale legend">1 = trifft gar nicht zu &nbsp;&middot;&nbsp; 5 = trifft voll zu</p>
    <div id="blockB"></div>
  </div>

  <!-- Cluster C -->
  <div class="card">
    <h2>6. Fuehrungsverhalten im Konflikt</h2>
    <p class="scale legend">1 = trifft gar nicht zu &nbsp;&middot;&nbsp; 5 = trifft voll zu</p>
    <div id="blockC"></div>
  </div>

  <!-- Cluster D -->
  <div class="card">
    <h2>7. Kommunikation und Veraenderung</h2>
    <p class="scale legend">1 = trifft gar nicht zu &nbsp;&middot;&nbsp; 5 = trifft voll zu</p>
    <div id="blockD"></div>
  </div>

  <!-- Cluster E -->
  <div class="card">
    <h2>8. Kosten und Wirkung</h2>
    <div id="blockE"></div>
  </div>

  <!-- Consent -->
  <div class="card">
    <label class="consent">
      <input type="checkbox" id="consent">
      <span>Ich willige ein, dass meine pseudonymisierten Antworten zur Vorbereitung und Auswertung des
      Workshops verarbeitet werden (Art. 6 Abs. 1 lit. a und lit. b DSGVO). Die Auswertung erfolgt in
      meinem Browser. Eine Uebermittlung an die Workshop Leitung erfolgt nur durch mich selbst. Die
      Einwilligung ist jederzeit widerrufbar. Naeheres in der <span id="dslink">Datenschutzinformation</span>.</span>
    </label>
  </div>

  <div id="form-actions">
    <div class="btnrow">
      <button type="button" class="primary" onclick="auswerten()">Auswertung anzeigen</button>
    </div>
    <p class="err" id="err">Bitte beantworte alle Fragen und setze die Einwilligung, dann erscheint die Auswertung.</p>
  </div>
  </form>

  <!-- RESULT -->
  <div class="card" id="result">
    <h2>Deine Auswertung</h2>
    <p class="sub" id="resmeta"></p>

    <div class="gesamt">
      <div class="lamp" id="gesamtlamp"></div>
      <div style="font-weight:700;font-size:1.1em" id="gesamttitle"></div>
      <div class="sub" id="gesamttxt"></div>
    </div>

    <div id="ampeln"></div>

    <div class="diag" id="diag"></div>

    <p class="legend-foot">Ampel: Gruen 0 bis 33 (stabil) &middot; Gelb 34 bis 66 (beobachten) &middot;
    Rot 67 bis 100 (Handlungsbedarf). Werte sind ein Spannungsindex, kein Urteil ueber dich.</p>

    <div class="btnrow">
      <button class="ghost" onclick="window.print()">Als PDF speichern</button>
      <button class="ghost" onclick="mailResult()">Per E-Mail senden</button>
      <button class="ghost" onclick="backToForm()">Zurueck</button>
    </div>
    <p class="note" id="copynote"></p>
  </div>

  <footer>
    <p>Diese Seite verwendet nur ein technisch notwendiges Sitzungscookie fuer den Passwortschutz, kein
    Tracking und keine externen Dienste. Deine Antworten werden nicht auf dem Server gespeichert, die
    Auswertung erfolgt ausschliesslich lokal in deinem Browser.</p>
    <h3>Impressum</h3>
    <p id="impressum"></p>
    <h3>Datenschutz (Kurzinformation)</h3>
    <p id="datenschutz"></p>
  </footer>
</div>

<script>
window.onerror=function(msg,src,line){var b=document.getElementById("jsbanner");if(b){b.style.display="block";b.textContent="Technischer Hinweis: "+msg+" (Zeile "+line+"). Bitte diesen Text an Alexander melden.";}return false;};
var FIRMA = <?php echo json_encode($_SESSION["firma"], JSON_UNESCAPED_UNICODE); ?>;
/* ============ KONFIGURATION (hier eure Daten eintragen) ============ */
var COACH_EMAIL = "info@kroes-consulting.com";   // Zieladresse fuer die Ergebnisse (bei Bedarf aendern)
var ANBIETER    = "AK Consulting &amp; Coaching, Alexander Kroes e.U.";
var ADRESSE     = "Unterer Stadtplatz 11, 6330 Kufstein";
/* =================================================================== */

/* ---- Fragen + Polung ----
   Skala-Polung: 'pos' = hoch ist gut (wird umgedreht), 'neg' = hoch ist Problem.
   Kategorial: jede Option hat einen Risikowert 0..100. score:false = nur Diagnose. */
var DATA = {
  A:{title:"Konflikt Landkarte", items:[
    {id:"A1", t:"Wie viele ernsthafte, ungeloeste Spannungen gibt es aktuell in deinem direkten Verantwortungsbereich?",
      cat:[["Keine",0],["Eine",25],["Zwei",50],["Drei",75],["Mehr als drei",100]]},
    {id:"A2", t:"Wo sitzt der haerteste aktuelle Konflikt?", score:false,
      cat:[["zwischen zwei Mitarbeitenden",0],["zwischen mir und einem Mitarbeitenden",0],
           ["zwischen Abteilungen",0],["zwischen mir und Inhaber bzw. Geschaeftsfuehrung",0],
           ["zwischen Generationen",0]]},
    {id:"A3", t:"Wie lange schwelt dieser Konflikt schon?",
      cat:[["unter 4 Wochen",20],["1 bis 3 Monate",40],["3 bis 6 Monate",60],["ueber 6 Monate",80],["ueber 1 Jahr",100]]},
    {id:"A4", t:"Wie offen ist der Konflikt?",
      cat:[["offen ausgesprochen",10],["allen klar, jedoch spricht es niemand offen an",70],
           ["nur ich kenne ihn",50],["wird aktiv seitens Vorgesetzter verdeckt",100]]}
  ]},
  B:{title:"Struktur und Rollen", items:[
    {id:"B5", t:"In meinem Bereich ist klar geregelt, wer welche Entscheidungen treffen darf.", pol:"pos"},
    {id:"B6", t:"Erwartungen an Rollen und Zustaendigkeiten sind fuer alle nachvollziehbar.", pol:"pos"},
    {id:"B7", t:"Wenn ein Konflikt eskaliert, gibt es einen klaren Weg, an wen er weitergegeben wird.", pol:"pos"},
    {id:"B8", t:"Getroffene Entscheidungen halten bei uns, statt staendig neu aufgerollt zu werden.", pol:"pos"}
  ]},
  C:{title:"Fuehrungsverhalten im Konflikt", items:[
    {id:"C9", t:"Ich spreche Spannungen aktiv an, sobald ich sie bemerke, statt zu warten.", pol:"pos"},
    {id:"C10", t:"Wenn zwei Mitarbeitende sich blockieren, weiss ich konkret, wie ich das Gespraech strukturiere.", pol:"pos"},
    {id:"C11", t:"In den letzten 3 Monaten habe ich einen schwierigen Konflikt vermieden oder aufgeschoben.", pol:"neg"},
    {id:"C12", t:"Ich trenne im Konflikt sauber zwischen Sachthema und Person.", pol:"pos"}
  ]},
  D:{title:"Kommunikation und Veraenderung", items:[
    {id:"D13", t:"Kritik und Widerspruch werden bei uns offen geaeussert, ohne dass es persoenlich wird.", pol:"pos"},
    {id:"D14", t:"Es gibt bei uns Themen, die jeder kennt, aber niemand offiziell anspricht.", pol:"neg"},
    {id:"D15", t:"Veraenderungen wie neue Prozesse oder Umstrukturierung loesen Widerstand aus, den ich schwer aufloesen kann.", pol:"neg"},
    {id:"D16", t:"Unterschiedliche Generationen oder Arbeitshaltungen fuehren bei uns spuerbar zu Reibung und Diskussionen.", pol:"neg"}
  ]},
  E:{title:"Kosten und Wirkung", items:[
    {id:"E17", t:"Wie viel Arbeitszeit pro Woche binden Konflikte und ihre Folgen bei dir persoenlich?",
      cat:[["unter 1 Std",15],["1 bis 3 Std",45],["3 bis 6 Std",75],["mehr als 6 Std",100]]},
    {id:"E18", t:"Ungeloeste Konflikte haben bei uns in den letzten 12 Monaten zu Kuendigung oder Fluktuation gefuehrt.",
      cat:[["ja, mehrfach",100],["ja, einmal",70],["vermutlich beigetragen",45],["nein",0]]},
    {id:"E19", t:"Konflikte blockieren bei uns aktuell konkrete Entscheidungen oder Projekte.",
      cat:[["Ja",100],["Nein",0]]},
    {id:"E20", t:"Wenn sich nichts aendert, haben die aktuellen Konfliktsituationen spaetestens in 6 Monaten spuerbare wirtschaftliche oder personelle Folgen.",
      cat:[["Ja, sehr wahrscheinlich",100],["bin mir nicht sicher",50],["nein, eher nicht",10]]}
  ]}
};

/* Interpretationstexte je Cluster und Ampel */
var TXT = {
  A:["Aktuell gibt es keine oder nur eine frische, offen sichtbare Spannung. Das ist eine gute Ausgangslage, weil offene und junge Konflikte sich am leichtesten klaeren lassen. Im Workshop geht es bei dir eher um Vorbeugung und das fruehe Erkennen, bevor etwas groesser wird.",
     "Es gibt mindestens eine spuerbare Spannung, die schon eine Weile besteht oder nicht ganz offen liegt. Solche Konflikte verschwinden selten von allein, sie binden im Hintergrund Energie und Aufmerksamkeit. Im Workshop schauen wir, wie du sie gezielt ansprichst, bevor sie sich verhaertet.",
     "Es sind mehrere oder schon lange schwelende Spannungen im Spiel, und sie liegen eher verdeckt als offen. Das ist die teuerste Form von Konflikt, weil viel Klaerungsarbeit noetig ist und die Lage instabil bleibt. Hier setzen wir im Workshop zuerst an, um die Konfliktlandschaft sichtbar und bearbeitbar zu machen."],
  B:["Zustaendigkeiten, Entscheidungswege und Eskalation sind in deinem Bereich klar geregelt. Das ist ein stabiles Fundament, denn viele Konflikte entstehen gar nicht erst, wenn jeder weiss, wer wofuer verantwortlich ist. Diese Klarheit ist dein Rueckhalt, wenn es einmal hitzig wird.",
     "An einzelnen Stellen sind Rollen oder Entscheidungen noch unscharf, oder Beschluesse werden immer wieder neu aufgerollt. Das erzeugt Reibung, weil unklar bleibt, wer den Hut aufhat. Im Workshop schaerfen wir diese Strukturen nach, damit Konflikte nicht aus Unklarheit entstehen.",
     "Rollen, Eskalationswege und Entscheidungen sind weitgehend unklar. Damit wird die Struktur selbst zum Konflikttreiber, weil staendig ueber Zustaendigkeiten gestritten wird statt ueber die Sache. Hier lohnt es sich, zuerst Ordnung in die Verantwortlichkeiten zu bringen."],
  C:["Du gehst Spannungen frueh und strukturiert an und trennst dabei Sache und Person. Das ist eine starke Konfliktfuehrung, die deinem Team Sicherheit gibt. Im Workshop geht es bei dir eher um Feinschliff und schwierige Spezialfaelle.",
     "Im Umgang mit Spannungen bist du teils noch zoegerlich oder ohne festes Vorgehen fuer das schwierige Gespraech. Das ist normal, weil das kaum jemandem beigebracht wurde. Im Workshop bekommst du konkrete Gespraechsstrukturen an die Hand, damit du in solchen Momenten klar fuehrst.",
     "Schwierige Konflikte werden eher vermieden, aufgeschoben oder ohne klare Methode gefuehrt. Das ist nachvollziehbar, kostet aber Wirkung, weil ungeloeste Spannungen zurueckkommen und groesser werden. Genau hier liegt dein persoenlicher Hebel, und der Workshop setzt mit praktischen Werkzeugen direkt dort an."],
  D:["Bei euch werden Kritik und Widerspruch offen geaeussert, und Veraenderungen werden gut mitgetragen. Diese offene Gespraechskultur ist ein echter Schutz vor verdeckten Konflikten. Sie ist eine Staerke, auf der ihr im Wandel aufbauen koennt.",
     "Es zeigen sich erste Tabuthemen oder Reibung bei Veraenderungen und zwischen Generationen. Solange das angesprochen wird, ist es gut steuerbar, unausgesprochen wird es jedoch schnell zur Belastung. Im Workshop ueben wir, solche Themen sicher auf den Tisch zu bringen.",
     "Tabus, Widerstand gegen Veraenderung und spuerbare Reibung praegen die Kommunikation. Wenn wichtige Themen nicht offen angesprochen werden, wachsen Konflikte im Verborgenen. Hier ist Klaerung dringend, und der Workshop schafft den geschuetzten Rahmen dafuer."],
  E:["Konflikte verursachen bei euch aktuell nur geringe wirtschaftliche und personelle Folgekosten. Das spricht dafuer, dass ihr frueh und gut gegensteuert. Ziel im Workshop ist, diesen guten Stand auch unter Druck zu halten.",
     "Konflikte kosten schon spuerbar Zeit und Nerven, und erste Folgen werden sichtbar. Das ist der Moment, in dem sich Gegensteuern am meisten lohnt, weil die Kosten sonst still weiter wachsen. Im Workshop machen wir diese versteckten Kosten greifbar und senken sie gezielt.",
     "Konflikte verursachen bereits hohe Kosten, etwa durch verlorene Zeit, Fluktuation oder blockierte Entscheidungen. Das ist ein direkter wirtschaftlicher Faktor, nicht nur ein Stimmungsthema. Hier zahlt sich die Arbeit im Workshop am schnellsten aus."],
  G:["Insgesamt zeigt sich eine solide Konfliktfaehigkeit. Im Workshop geht es bei dir vor allem um Feinschliff und Vorbeugung, damit das so bleibt.",
     "Insgesamt gibt es mehrere Spannungsfelder, die noch gut bearbeitbar sind. Der Workshop setzt gezielt an deinen gelben und roten Clustern an.",
     "Insgesamt besteht deutlicher Handlungsdruck. Der Workshop fokussiert zuerst die roten Cluster und bringt dort schnell spuerbare Entlastung."]
};

var COLORS=["var(--gruen)","var(--gelb)","var(--rot)"];
var BANDNAME=["Gruen","Gelb","Rot"];

/* ---- Render ---- */
function render(){
  document.getElementById("datum").valueAsDate=new Date();
  ["A","B","C","D","E"].forEach(function(k){
    var block=document.getElementById("block"+k), html="";
    DATA[k].items.forEach(function(it){
      html+='<div class="q" id="q_'+it.id+'"><div class="qt"><span class="qn">'+it.id+'</span>'+it.t+'</div>';
      if(it.cat){
        html+='<div class="opts">';
        it.cat.forEach(function(o,i){
          html+='<label class="opt"><input type="radio" name="'+it.id+'" value="'+i+'"><span>'+o[0]+'</span></label>';
        });
        html+='</div>';
      } else {
        html+='<div class="scale">';
        for(var v=1;v<=5;v++){
          html+='<label class="opt"><input type="radio" name="'+it.id+'" value="'+v+'"><span>'+v+'</span></label>';
        }
        html+='</div>';
      }
      html+='</div>';
    });
    block.innerHTML=html;
  });
  // Highlight entfernen, sobald eine Frage beantwortet wird
  document.querySelectorAll('input[type="radio"]').forEach(function(r){
    r.addEventListener("change", function(){
      var q=r.closest(".q"); if(q) q.classList.remove("missing");
    });
  });
  document.getElementById("consent").addEventListener("change", function(){
    document.querySelector(".consent").classList.remove("missing");
  });
}

function buildCode(){
  var m=(document.getElementById("cm").value||"").trim();
  var d=(document.getElementById("cd").value||"").trim();
  var n=(document.getElementById("cn").value||"").trim();
  var code="&ndash;";
  if(m.length>=2 && d!=="" && n.length>=1){
    var dd=("0"+parseInt(d,10)).slice(-2);
    code=(m.substring(0,2)+dd+n.slice(-1)).toUpperCase();
  }
  document.getElementById("codeval").innerHTML=code;
  return code;
}

function band(idx){ return idx<=33?0 : idx<=66?1 : 2; }

function answered(id){
  var els=document.getElementsByName(id);
  for(var i=0;i<els.length;i++){ if(els[i].checked) return els[i].value; }
  return null;
}

function clusterIndex(k){
  var sum=0,cnt=0,info=null;
  DATA[k].items.forEach(function(it){
    var v=answered(it.id);
    if(it.cat){
      if(it.score===false){ if(v!==null) info=it.cat[parseInt(v,10)][0]; return; }
      if(v!==null){ sum+=it.cat[parseInt(v,10)][1]; cnt++; }
    } else {
      if(v!==null){
        var n=parseInt(v,10);
        var risk = it.pol==="pos" ? (5-n)/4*100 : (n-1)/4*100;
        sum+=risk; cnt++;
      }
    }
  });
  return {idx: cnt? Math.round(sum/cnt):0, info:info};
}

function allAnswered(){
  var ok=true;
  ["A","B","C","D","E"].forEach(function(k){
    DATA[k].items.forEach(function(it){ if(answered(it.id)===null) ok=false; });
  });
  if(!document.getElementById("consent").checked) ok=false;
  return ok;
}

var LAST="";
function auswerten(){
  // alte Markierungen entfernen
  document.querySelectorAll(".q.missing").forEach(function(e){ e.classList.remove("missing"); });
  document.querySelector(".consent").classList.remove("missing");

  var missing=[];
  ["A","B","C","D","E"].forEach(function(k){
    DATA[k].items.forEach(function(it){
      if(answered(it.id)===null){
        missing.push(it.id);
        var el=document.getElementById("q_"+it.id); if(el) el.classList.add("missing");
      }
    });
  });
  var consentOk=document.getElementById("consent").checked;
  if(!consentOk) document.querySelector(".consent").classList.add("missing");

  if(missing.length>0 || !consentOk){
    var err=document.getElementById("err"), msg="";
    if(missing.length>0) msg="Es fehlen noch "+missing.length+" Antwort"+(missing.length>1?"en":"")+". ";
    if(!consentOk) msg+="Bitte setze zusaetzlich die Einwilligung.";
    err.textContent=msg;
    err.style.display="block";
    var first = missing.length>0 ? document.getElementById("q_"+missing[0]) : document.querySelector(".consent");
    if(first && first.scrollIntoView) first.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  document.getElementById("err").style.display="none";

  var code=buildCode();
  var firma=FIRMA||"&ndash;";
  var datum=document.getElementById("datum").value||"";

  var keys=["A","B","C","D","E"], res={}, total=0, diagInfo="";
  keys.forEach(function(k){ res[k]=clusterIndex(k); total+=res[k].idx; if(res[k].info) diagInfo=res[k].info; });
  var gesamt=Math.round(total/keys.length), gb=band(gesamt);

  document.getElementById("resmeta").innerHTML="Code "+code+" &middot; "+firma+" &middot; "+datum;
  document.getElementById("gesamtlamp").style.background=COLORS[gb];
  document.getElementById("gesamttitle").innerHTML="Gesamt: "+BANDNAME[gb]+" ("+gesamt+"/100)";
  document.getElementById("gesamttxt").innerHTML=TXT.G[gb];

  var rows="";
  keys.forEach(function(k){
    var b=band(res[k].idx);
    rows+='<div class="ampelrow"><div class="dot" style="background:'+COLORS[b]+'"></div>'+
      '<div class="meta"><div class="name">'+DATA[k].title+'</div>'+
      '<div class="idx">'+BANDNAME[b]+' &middot; Index '+res[k].idx+'/100</div>'+
      '<div class="txt">'+TXT[k][b]+'</div></div></div>';
  });
  document.getElementById("ampeln").innerHTML=rows;
  document.getElementById("diag").innerHTML="<strong>Diagnose Konfliktort (A2):</strong> "+
    (diagInfo? diagInfo : "keine Angabe");

  /* Klartext fuer Versand */
  var lines=["Vorab Fragebogen Konfliktmanagement","Code: "+code,"Unternehmen: "+firma,"Datum: "+datum,"",
    "GESAMT: "+BANDNAME[gb]+" ("+gesamt+"/100)",""];
  keys.forEach(function(k){
    lines.push(DATA[k].title+": "+BANDNAME[band(res[k].idx)]+" ("+res[k].idx+"/100)");
  });
  lines.push("Konfliktort (A2): "+(diagInfo||"keine Angabe"),"","Einzelantworten:");
  keys.forEach(function(k){
    DATA[k].items.forEach(function(it){
      var v=answered(it.id), label="";
      if(it.cat){ label=it.cat[parseInt(v,10)][0]; }
      else { label=v; }
      lines.push("  "+it.id+": "+label);
    });
  });
  LAST=lines.join("\n").replace(/&ndash;/g,"-").replace(/ae/g,"ae").replace(/oe/g,"oe")
            .replace(/ue/g,"ue").replace(/ss/g,"ss");

  document.getElementById("form").style.display="none";
  document.getElementById("result").style.display="block";
  window.scrollTo(0,0);
}

function backToForm(){
  document.getElementById("result").style.display="none";
  document.getElementById("form").style.display="block";
  window.scrollTo(0,0);
}
function copyResult(){
  navigator.clipboard.writeText(LAST).then(function(){
    document.getElementById("copynote").textContent="Ergebnis kopiert. Bitte in eine E-Mail an die Workshop Leitung einfuegen.";
  },function(){ document.getElementById("copynote").textContent="Kopieren nicht moeglich, bitte Text markieren."; });
}
function mailResult(){
  var subj=encodeURIComponent("Vorab Fragebogen "+(LAST.split("\n")[1]||""));
  var body=encodeURIComponent(LAST);
  window.location.href="mailto:"+COACH_EMAIL.replace(/&amp;/g,"&")+"?subject="+subj+"&body="+body;
}

/* ---- Rechtsraum AT / DE ---- */
function setRegion(r){
  var imp=document.getElementById("impressum"), ds=document.getElementById("datenschutz");
  if(r==="AT"){
    imp.innerHTML=ANBIETER+", "+ADRESSE+". Angaben gemaess &sect;5 ECG und &sect;25 MedienG. "+
      "[Vollstaendiges Impressum verlinken]";
    ds.innerHTML="Verantwortlicher: "+ANBIETER+". Rechtsgrundlage: Art. 6 Abs. 1 lit. a und lit. b DSGVO. "+
      "Es werden keine Daten serverseitig gespeichert. Aufsichtsbehoerde: Oesterreichische "+
      "Datenschutzbehoerde (DSB), Wien. [Vollstaendige Datenschutzerklaerung verlinken]";
  } else {
    imp.innerHTML=ANBIETER+", "+ADRESSE+". Angaben gemaess &sect;5 DDG. "+
      "[Vollstaendiges Impressum verlinken]";
    ds.innerHTML="Verantwortlicher: "+ANBIETER+". Rechtsgrundlage: Art. 6 Abs. 1 lit. a und lit. b DSGVO "+
      "i. V. m. BDSG. Es werden keine Daten serverseitig gespeichert. Aufsichtsbehoerde: die fuer "+
      "den Verantwortlichen zustaendige Landesdatenschutzbehoerde. "+
      "[Vollstaendige Datenschutzerklaerung verlinken]";
  }
}

render();
setRegion("AT");
</script>
</body>
</html>
