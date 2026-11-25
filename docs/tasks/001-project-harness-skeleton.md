# 001 — Projekto darbo tvarka, programos skeletas ir pirmas Excel importas

- **Būsena:** 1 etapas DONE; 2 etapas BLOCKED
- **Data:** 2026-11-25
- **1 etapas:** DONE (priimta 2026-11-25)
- **2 etapas:** BLOCKED — reikia originalaus tiekėjo `.xlsx` pavyzdžio

## Tikslas

Paruošti agento darbo tvarką ir „Windows“ programos skeletą, per kurį vėliau bus
importuojamas vienas sutarto formato tiekėjo Excel pakavimo sąrašas. Šiame etape
įgyvendinta tik darbo tvarka ir skeletas be verslo funkcijų.

## 1 etapo apimtis (šis pristatymas)

- `AGENTS.md`, `docs/tasks/`, `docs/decisions.md`, `docs/environment.md`.
- npm workspaces monorepo su `apps/desktop` ir `apps/api`.
- Electron + React + TypeScript klientas su „Excel importas“ ekrano skeletu (mygtukai
  neaktyvūs, jokio failo skaitymo).
- TypeScript + Fastify API su `GET /health`; Prisma schema PostgreSQL bazei (laikina).
- Konfigūruojamas kliento API adresas per `GOODS_IMPORT_API_URL`.
- `README.md` su instaliacijos, paleidimo ir patikros komandomis.

## Ne apimtis (1 etapas)

- Excel failo skaitymas, lapo/stulpelių validacija, importo endpointai, DB įrašymas.
- Electron installeris, diegimas į Contabo, autentifikacija.
- Galutinis duomenų modelis (bus patikslintas pagal tiekėjo failą).

## Darbai

- [x] Sukurti `AGENTS.md` su aktyvios užduoties vieta, komandomis ir READY taisykle.
- [x] Sukurti `docs/tasks/` registrą ir šį užduoties failą.
- [x] Sukurti `docs/decisions.md` su stack ir importo sprendimais.
- [x] Dokumentuoti DSH/Windows aplinkos sprendimus `docs/environment.md`.
- [x] Sukurti monorepo struktūrą ir npm workspaces.
- [x] Sukurti Electron + React + TypeScript kliento skeletą.
- [x] Sukurti TypeScript API su `/health` ir Prisma schema.
- [x] Įgyvendinti konfigūruojamą API adresą (main → preload → renderer).
- [x] Užtikrinti Electron binary atsisiuntimą po `npm install` (`scripts/ensure-electron.mjs`).
- [x] Atnaujinti `README.md`.
- [x] Atlikti ir užfiksuoti patikrą (žr. žemiau).
- [ ] 2 etapas: Excel importas — laukiama pavyzdžio.

## Priėmimo kriterijai (1 etapas)

- [x] `npm.cmd install` baigiasi be klaidų.
- [x] `npm.cmd run typecheck` baigiasi be klaidų.
- [x] `npm.cmd run build` baigiasi be klaidų.
- [x] `GET /health` grąžina `200` ir `{"status":"ok","service":"goods-import-api"}`.
- [x] `npm.cmd run dev:desktop` atidaro langą; matomas „Excel importas“ ekranas.
- [x] API adresas keičiamas per `GOODS_IMPORT_API_URL` ir parodomas UI.
- [x] Importo logikos nėra: UI mygtukai neaktyvūs, API neturi importo endpointų.

## 2 etapo priėmimo kriterijai (Excel importas)

| Bandymas                                                                     | Laukiamas rezultatas                                                                                   |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Importuojamas sutartas pavyzdinis pakavimo sąrašas                           | Bazėje atsiranda vienas importas; išsaugotų eilučių skaičius sutampa su pavyzdžiu.                     |
| Pasirinkta Excel eilutė lyginama su įrašu bazėje                             | Originalus barkodas ir kaina sutampa su šaltiniu; priekiniai barkodo nuliai išlieka.                   |
| Pavyzdžio kopijoje pašalinamas privalomas stulpelis arba sugadinama reikšmė   | Programa parodo konkrečią klaidą (stulpelis arba eilutė + stulpelis + priežastis); naujo importo nėra. |
| Importuojama, kai bendras serveris nepasiekiamas                             | Vartotojas mato ryšio klaidą ir gali pakartoti importą atkūrus ryšį.                                   |

## Atviri klausimai ir blokas

- **Nėra originalaus tiekėjo pakavimo sąrašo.** Repo neturi jokio `.xlsx` failo. Reikia
  gauti failą ir suderinti: lapo pavadinimą, privalomus stulpelius, eilučių skaičių,
  barkodo formatą (priekiniai nuliai), kainos formatą.
- BRIO importo šablonas šiam etapui netinka — jis skirtas kitam darbo etapui.
- Kol pavyzdžio nėra, lapas, stulpeliai ir eilučių skaičius nefiksuojami, o importo
  logika nekuriama.

## Patikros rezultatas

Aplinka: Windows 11 (build 26300), Node.js 24.20.0, npm 12.2.2, Electron 44.11.5,
Prisma 6.19.3. Data: 2026-11-25.

### Priklausomybės ir Prisma

- `npm.cmd install` → `INSTALL_EXIT=0`; 178 paketai; Electron binary rastas per
  `scripts/ensure-electron.mjs`.
- `npm.cmd run prisma:validate` → `The schema at prisma\schema.prisma is valid`.
- `npm.cmd run prisma:generate` → `Generated Prisma Client (v6.19.3)`.

### Typecheck ir build

- `npm.cmd run typecheck` → exit 0 (API ir desktop, `tsc --noEmit`).
- `npm.cmd run build` → exit 0:
  - API: `apps/api/dist`;
  - desktop: `apps/desktop/out/main/index.js`, `out/preload/index.js`,
    `out/renderer/index.html` + assets.

### API

`GET /health` (paleistas iš `apps/api/dist/server.js`):

```text
HEALTH_STATUS=200
HEALTH_BODY={"status":"ok","service":"goods-import-api"}
```

### GUI

- `npm.cmd run dev:desktop` paleistas DSH shell'e po
  `Remove-Item Env:ELECTRON_RUN_AS_NODE`; Electron langas atsidarė, pavadinimas
  „Goods Import“.
- Ekrano kopija: [001-excel-import-skeleton.png](../screenshots/001-excel-import-skeleton.png).
- Matoma: „Pakavimo sąrašo importas“, neaktyvūs „Pasirinkti .xlsx“ / „Importuoti“
  mygtukai, failo ir eilučių vietos, API adresas `http://127.0.0.1:3001`.

### Aplinkos pastabos

DSH shell `spawn EPERM` priežastis ir pataisa, Electron Low integrity label bei
`ELECTRON_RUN_AS_NODE` aprašyti [docs/environment.md](../environment.md).

## Ką patvirtina

- Programa paleidžiama per Electron ir rodo sutartą „Excel importas“ ekraną be verslo
  logikos.
- API veikia atskirai ir grąžina sutartą `/health` atsakymą.
- Kliento API adresas konfigūruojamas ir matomas UI.
- TypeScript projektas kompiliuojasi ir sukonstruojamas be klaidų.
- 2 etapo funkcionalumas sąmoningai neįgyvendintas, nes nėra Excel pavyzdžio.

## Ataskaita žmogui

Paleidimas:

```powershell
npm.cmd install
npm.cmd run dev:api        # 1 terminalas
npm.cmd run dev:desktop    # 2 terminalas
```

Patikra:

```powershell
npm.cmd run typecheck
npm.cmd run build
Invoke-RestMethod http://127.0.0.1:3001/health
```

Laukiama: `200` + `{"status":"ok","service":"goods-import-api"}` ir „Goods Import“ langas.
1 etapas priimtas 2026-11-25; 2 etapo laukiama originalaus tiekėjo Excel failo.
