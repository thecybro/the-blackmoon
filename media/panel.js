const vscode = acquireVsCodeApi();

const $ = (id) => document.getElementById(id);

let bootDone = false;

function init() {
  setTimeout(() => {
    const overlay = $('bootOverlay');
    if (overlay) {
      overlay.style.pointerEvents = 'none';
      setTimeout(() => overlay.remove(), 300);
    }
    bootDone = true;
  }, 2500);

  $('btnProblems').addEventListener('click', () => {
    vscode.postMessage({ command: 'openProblems' });
  });

  $('btnAlert').addEventListener('click', () => {
    vscode.postMessage({ command: 'triggerAlert' });
  });

  $('btnTheme').addEventListener('click', () => {
    vscode.postMessage({ command: 'toggleTheme' });
  });

  startClock();
  vscode.postMessage({ command: 'requestData' });
}

window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.type === 'update') {
    applyData(msg.data);
  }
});

function applyData(d) {
  setText('pilotName', d.pilot || 'IKARI');

  const initial = (d.pilot || 'I')[0];
  const pilotInitial = document.getElementById('pilotInitial');
  if (pilotInitial) pilotInitial.textContent = initial;

  setText('workspaceName', d.workspaceName || 'NO MISSION');
  setText('activeFile', d.activeFilename ? `▶ ${d.activeFilename}` : '— NO ACTIVE FILE');

  const rate = parseFloat(d.syncRate || '0');
  setText('syncRate', `${d.syncRate}%`);
  const bar = $('syncBar');
  if (bar) bar.style.width = `${rate}%`;

  d.magiRates?.forEach((r, i) => {
    const el = $('magi' + i);
    const val = $('magiVal' + i);
    if (el) el.style.width = r + '%';
    if (val) val.textContent = r + '%';
  });

  const errors = d.totalErrors || 0;
  const warns  = d.totalWarnings || 0;

  setText('errorCount', errors);
  setText('warnCount', warns);
  setText('editorCount', d.openEditors || 0);

  const integrity = errors > 5 ? '12%' : errors > 2 ? '48%' : errors > 0 ? '74%' : '100%';
  const threat    = errors > 5 ? 'CRITICAL' : errors > 2 ? 'ELEVATED' : errors > 0 ? 'CAUTION' : 'NOMINAL';
  const threatColor = errors > 2 ? '#ff1437' : errors > 0 ? '#ffaa00' : '#00ff88';

  setText('atIntegrity', integrity);
  const threatEl = $('threatLevel');
  if (threatEl) {
    threatEl.textContent = threat;
    threatEl.style.color = threatColor;
  }
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = String(value);
}

function startClock() {
  function tick() {
    const now  = new Date();
    const pad  = (n) => String(n).padStart(2, '0');
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    setText('clockRow', `${time}  //  SECTOR 3-G`);
  }
  tick();
  setInterval(tick, 1000);
}

init();
