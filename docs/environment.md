# Aplinkos sprendimai (DSH / Windows)

Šis failas dokumentuoja šios darbo mašinos aplinkos problemas, kurios nepriklauso nuo
programos kodo, ir jų sprendimus. Kitame kompiuteryje šių veiksmų gali neprireikti.

## 1. DSH shell: `cannot start "pwsh": spawn EPERM`

**Simptomas:** agento `pwsh` įrankis krenta su `cannot start "pwsh": spawn EPERM`, nors
paprastame PowerShell lange komandos veikia.

**Priežastis:** DSH ieško `pwsh.exe` šiose vietose: `C:\Program Files\PowerShell\7`,
tada `PATH`. Šioje mašinoje `C:\Program Files\PowerShell\7\pwsh.exe` nėra, todėl
resolveris pasirenka Windows Store aliasą
`C:\Users\msmig\AppData\Local\Microsoft\WindowsApps\pwsh.exe`. DSH procesui bandant jį
paleisti, gaunamas `EPERM`.

**Sprendimas:** DSH profilio papildyme nurodytas konkretus veikiantis PowerShell 5.1
kelias. Failas `C:\Users\msmig\.dsh\profiles\desktop\cordis.patch.yml`:

```yaml
- id: pwsh-sandbox
  name: "@deepseek-ai/dsh-pwsh-sandbox"
  config:
    pwshPath: 'C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe'
```

Po šio pakeitimo DSH shell veikia (PowerShell 5.1), o `npm`, `node`, `git`, `icacls`
komandos paleidžiamos agento. Tai **ne repo** konfigūracija ir necommitinama.

## 2. Electron krenta `0xc0000005` / `0x80000003` darbo aplanke

**Simptomas:** `npm.cmd run dev:desktop` paleidžia Vite, bet Electron iškart iškrenta
(`2147483651` = `0x80000003`), o Windows Event Log rodo `electron.exe` `0xc0000005`.
Tas pats Electron binary, nukopijuotas į `%TEMP%`, veikia.

**Priežastis:** darbo aplankas turėjo `Low Mandatory Level` integrity label
(Codex/DSH sandbox palikimas). Visi failai, įskaitant `electron.exe`, paveldėdavo Low
integrity lygį, o Chromium/Electron sandbox tokiame procese negali normaliai startuoti.
Papildomai buvo likę `CodexSandboxUsers`, `S-1-4-*` ir `Everyone Deny` ACL įrašų.

**Sprendimas:** pakeltas aplanko integrity lygis į Medium:

```powershell
icacls "C:\Users\msmig\Projektai\goods-import" /setintegritylevel '(OI)(CI)Medium'
```

Patikra:

```powershell
icacls "C:\Users\msmig\Projektai\goods-import" | Select-String 'Mandatory Label'
# Mandatory Label\Medium Mandatory Level:(OI)(CI)(NW)
```

DACL likučiai buvo išvalyti atskirai (`apps` ir `node_modules` ACL reset). Prieš tai
padaryta atsarginė kopija:
`C:\Users\msmig\Projektai\goods-import-acl-backup\workspace-acl.txt`.

> Tai aplinkos, o ne programos pataisa. Ji daroma vieną kartą šiam darbo aplankui;
> į repo kodą neįtraukiama. Kitame kompiuteryje žymės gali nebūti, o `icacls`
> integrity lygio keitimui gali prireikti administratoriaus teisių.

## 3. Electron paleidžiamas kaip Node: `electron.app` undefined

**Simptomas:** DSH shell'e paleidus `npm.cmd run dev:desktop`, gaunama
`TypeError: Cannot read properties of undefined (reading 'whenReady')`.

**Priežastis:** DSH agento shell'exportuoja `ELECTRON_RUN_AS_NODE=1`. Paveldėjęs Electron
paleidžiamas kaip Node, todėl `require('electron')` grąžina ne Electron API.

**Sprendimas** (tik agento shell'e, prieš GUI patikrą):

```powershell
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
npm.cmd run dev:desktop
```

Įprastame Windows terminale šio kintamojo nėra.

## 4. npm 12 užblokuoti dependency install scriptai

**Simptomas:** `npm install` praneša
`N packages had install scripts blocked because they are not covered by allowScripts`,
o Electron binary neatsiranda.

**Sprendimas:** patvirtinti reikalingus scriptus ir įdiegti iš naujo:

```powershell
npm.cmd install-scripts ls
npm.cmd install-scripts approve --all
npm.cmd install
```

Patvirtinimai saugomi repo šaknies `package.json` lauke `allowScripts`, todėl kitas
`npm install` jų neblokuoja. Electron 44 pakete `postinstall` nėra, todėl papildomai
veikia `scripts/ensure-electron.mjs` (paleidžiamas iš `postinstall`).

## 5. Patikros eiga agentui

```powershell
# DSH shell'e, jei tikrinamas GUI:
Remove-Item Env:ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue

npm.cmd install
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev:desktop   # turi atsidaryti „Goods Import“ langas
```

API patikra atskirai:

```powershell
npm.cmd run dev:api
Invoke-RestMethod http://127.0.0.1:3001/health
```
