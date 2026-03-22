'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.activate = activate;
exports.deactivate = deactivate;

const vscode = require('vscode');
const path = require('path');

let statusBarLeft, statusBarCenter, statusBarRight;
let diagnosticListener, tickInterval;
let magiProvider;
let lastAlertTime = 0;

const ANGEL_ALERTS = [
    '\u26a0 ANGEL DETECTED \u2014 PATTERN BLUE CONFIRMED',
    '\u26a0 AT-FIELD BREACH \u2014 SECTOR 7-G',
    '\u26a0 UNKNOWN ENTITY IN CODEBASE \u2014 SCRAMBLE UNITS',
    '\u26a0 SYNCHRONIZATION FAILURE \u2014 CHECK PILOT STATUS',
    '\u26a0 MAGI OVERRIDE REQUESTED \u2014 STAND BY',
    '\u26a0 THIRD IMPACT PROTOCOL \u2014 ERRORS DETECTED',
];

function activate(context) {
    buildStatusBar(context);
    magiProvider = new MagiPanelProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('nerv.magiPanel', magiProvider)
    );
    context.subscriptions.push(
        vscode.commands.registerCommand('nerv.openPanel', () => vscode.commands.executeCommand('nerv.magiPanel.focus')),
        vscode.commands.registerCommand('nerv.angelAlert', () => {
            const msg = ANGEL_ALERTS[Math.floor(Math.random() * ANGEL_ALERTS.length)];
            vscode.window.showWarningMessage(msg);
        }),
        vscode.commands.registerCommand('nerv.toggleMagi', () => vscode.commands.executeCommand('nerv.magiPanel.focus')),

        vscode.commands.registerCommand('nerv.toggleTheme', async () => {
            const config = vscode.workspace.getConfiguration();
            const current = config.get('workbench.colorTheme');
            const next = current === 'NERV Dark' ? 'Default Dark Modern' : 'NERV Dark';
            await config.update('workbench.colorTheme', next, vscode.ConfigurationTarget.Global);
        })
    );
    watchDiagnostics(context);
    startTicker();
    vscode.window.setStatusBarMessage('$(shield) NERV COMMAND CENTER ONLINE \u2014 God\'s in his heaven. All\'s right with the world.', 5000);
}

function buildStatusBar(context) {
    const cfg = vscode.workspace.getConfiguration('nerv');
    const pilot = cfg.get('pilotName', 'IKARI');

    statusBarLeft = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
    statusBarLeft.text = '$(shield) NERV';
    statusBarLeft.tooltip = 'NERV Command Center';
    statusBarLeft.command = 'nerv.openPanel';
    statusBarLeft.show();

    statusBarCenter = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 999);
    statusBarCenter.text = 'PILOT: ' + pilot.toUpperCase();
    statusBarCenter.show();

    statusBarRight = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
    statusBarRight.text = getSyncRateText();
    statusBarRight.command = 'nerv.openPanel';
    statusBarRight.show();

    context.subscriptions.push(statusBarLeft, statusBarCenter, statusBarRight);
}

function getSyncRateText() {
    const rate = (97 + Math.random() * 2.9).toFixed(1);
    return 'SYNC: ' + rate + '%  \u25aa\u25aa\u25aa\u25aa\u25aa';
}

function startTicker() {
    tickInterval = setInterval(() => {
        if (statusBarRight) statusBarRight.text = getSyncRateText();
        if (magiProvider) magiProvider.refresh();
    }, 3000);
}

function watchDiagnostics(context) {
    diagnosticListener = vscode.languages.onDidChangeDiagnostics((e) => {
        const cfg = vscode.workspace.getConfiguration('nerv');
        if (!cfg.get('enableAlerts', true)) return;
        const now = Date.now();
        if (now - lastAlertTime < 8000) return;
        for (const uri of e.uris) {
            const diags = vscode.languages.getDiagnostics(uri);
            const errors = diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error);
            if (errors.length > 0) {
                lastAlertTime = now;
                const alert = ANGEL_ALERTS[Math.floor(Math.random() * ANGEL_ALERTS.length)];
                const filename = path.basename(uri.fsPath);
                vscode.window.showWarningMessage(
                    alert + ' [' + filename + ': ' + errors.length + ' error' + (errors.length > 1 ? 's' : '') + ']',
                    'View Errors', 'Dismiss'
                ).then(choice => {
                    if (choice === 'View Errors') vscode.commands.executeCommand('workbench.actions.view.problems');
                });
                break;
            }
        }
    });
    context.subscriptions.push(diagnosticListener);
}

function deactivate() {
    if (tickInterval) clearInterval(tickInterval);
}

class MagiPanelProvider {
    constructor(extensionUri) {
        this._extensionUri = extensionUri;
        this._view = undefined;
    }

    resolveWebviewView(webviewView) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this.buildHtml(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(msg => {
            if (msg.command === 'requestData') this.sendData();
            if (msg.command === 'openProblems') vscode.commands.executeCommand('workbench.actions.view.problems');
            if (msg.command === 'triggerAlert') vscode.commands.executeCommand('nerv.angelAlert');
            if (msg.command === 'toggleTheme') vscode.commands.executeCommand('nerv.toggleTheme');
        });
    }

    refresh() {
        if (this._view) this.sendData();
    }

    sendData() {
        if (!this._view) return;
        const editors = vscode.window.visibleTextEditors;
        const activeDoc = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
        const activeFilename = activeDoc ? path.basename(activeDoc.fileName) : null;
        const allDiags = vscode.languages.getDiagnostics();
        let totalErrors = 0, totalWarnings = 0;
        for (const [, diags] of allDiags) {
            totalErrors   += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
            totalWarnings += diags.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
        }
        const cfg = vscode.workspace.getConfiguration('nerv');
        const pilot = cfg.get('pilotName', 'IKARI');
        const folders = vscode.workspace.workspaceFolders;
        const workspaceName = folders && folders[0] ? folders[0].name : 'NO MISSION';
        this._view.webview.postMessage({
            type: 'update',
            data: {
                pilot: pilot.toUpperCase(),
                workspaceName: workspaceName.toUpperCase(),
                activeFilename,
                openEditors: editors.length,
                totalErrors,
                totalWarnings,
                syncRate: (97 + Math.random() * 2.9).toFixed(1),
                magiRates: [
                    (90 + Math.random() * 9).toFixed(0),
                    (85 + Math.random() * 12).toFixed(0),
                    (88 + Math.random() * 10).toFixed(0),
                ],
            },
        });
    }

    buildHtml(webview) {
        const mediaUri = (file) => webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', file));
        const cssUri = mediaUri('panel.css');
        const jsUri  = mediaUri('panel.js');
        return `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src ${webview.cspSource};">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="${cssUri}">
                <title>BLACK MOON</title>

                </head>
                <body> 
                <div class="boot-overlay" id="bootOverlay">
                    <div class="boot-logo">
                        THE<br>BLACK MOON
                    </div>
                    <div class="boot-tagline">God's in his heaven.<br> All's right with the world.</div>
                    <div class="boot-bar"><div class="boot-fill"></div></div>
                </div>

                <div class="root" id="root">
                    <div class="panel-header">
                    <div class="panel-title-row">
                        <span class="panel-title">MAGI SYSTEM</span>
                        <span class="panel-status-dot"></span>
                    </div>

                    <div class="panel-subtitle">SPECIAL AGENCY NERV &mdash; SUPERCOMPUTER</div>
                    </div>

                    <div class="section">
                    <div class="section-label">OPERATOR</div>
                    <div class="operator-row">
                        <div class="operator-hex">
                        <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 1L39 11.5V34.5L20 45L1 34.5V11.5L20 1Z" stroke="#ff6600" stroke-width="1.5"/>
                            <text x="20" y="29" text-anchor="middle" fill="#ff6600" font-family="Orbitron,monospace" font-size="11" font-weight="900" id="pilotInitial">I</text>
                        </svg>
                        </div>

                        <div class="operator-info">
                        <div class="operator-name" id="pilotName">IKARI</div>
                        <div class="operator-meta" id="workspaceName">NO MISSION</div>
                        <div class="operator-meta" id="activeFile">&mdash;</div>
                        </div>
                    </div>
                    </div>
                    <div class="section">
                    <div class="section-label">SYNCHRONIZATION</div>
                    <div class="sync-display">
                        <span class="sync-rate" id="syncRate">&mdash;.&mdash;%</span>
                        <span class="sync-label">SYNC RATE</span>
                    </div>

                    <div class="sync-bar-wrap"><div class="sync-bar" id="syncBar" style="width:0%"></div></div>
                    </div>
                    <div class="section">
                    <div class="section-label">MAGI SUPERCOMPUTER</div>
                    <div class="magi-units">
                        <div class="magi-unit">
                        <div class="magi-unit-label">MELCHIOR-1</div>
                        <div class="magi-bar-wrap"><div class="magi-bar" id="magi0" style="width:0%"></div></div>
                        <div class="magi-unit-val" id="magiVal0">&mdash;</div>
                        </div>

                        <div class="magi-unit">
                        <div class="magi-unit-label">BALTHASAR-2</div>
                        <div class="magi-bar-wrap"><div class="magi-bar magi-bar-2" id="magi1" style="width:0%"></div></div>
                        <div class="magi-unit-val" id="magiVal1">&mdash;</div>
                        </div>

                        <div class="magi-unit">
                        <div class="magi-unit-label">CASPAR-3</div>
                        <div class="magi-bar-wrap"><div class="magi-bar magi-bar-3" id="magi2" style="width:0%"></div></div>
                        <div class="magi-unit-val" id="magiVal2">&mdash;</div>
                        </div>
                    </div>
                    </div>

                    <div class="section">
                    <div class="section-label">BATTLE STATUS</div>
                    <div class="battle-grid">
                        <div class="battle-cell">
                        <div class="battle-val" id="errorCount">0</div>
                        <div class="battle-key">ANGELS</div>
                        </div>

                        <div class="battle-cell">
                        <div class="battle-val battle-warn" id="warnCount">0</div>
                        <div class="battle-key">WARNINGS</div>
                        </div>

                        <div class="battle-cell">
                        <div class="battle-val battle-info" id="editorCount">0</div>
                        <div class="battle-key">SECTORS</div>
                        </div>
                    </div>
                    </div>

                    <div class="section">
                    <div class="section-label">AT-FIELD STATUS</div>
                    <div class="at-field">
                        <div class="at-row"><span class="at-key">BARRIER</span><span class="at-val at-green">ACTIVE</span></div>
                        <div class="at-row"><span class="at-key">INTEGRITY</span><span class="at-val" id="atIntegrity">100%</span></div>
                        <div class="at-row"><span class="at-key">THREAT LVL</span><span class="at-val" id="threatLevel">NOMINAL</span></div>
                    </div>
                    </div>

                    <div class="section">
                    <div class="section-label">ACTIONS</div>
                    <div class="action-buttons">
                        <button class="action-btn" id="btnProblems">VIEW ERRORS</button>
                        <button class="action-btn action-btn-alert" id="btnAlert">ANGEL ALERT</button>
                        <button class="action-btn" id="btnTheme" >DISCARD CURRENT THEME</button>
                    </div>
                    </div>
                    
                    <div class="clock-row" id="clockRow">--:--:--  //  SECTOR 3-G</div>
                </div>
                <script src="${jsUri}"></script>
                </body>
                </html>
            `;
    }
}
