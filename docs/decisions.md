# Sprendimų žurnalas (ADR)

Trumpi architektūriniai sprendimai. Naują sprendimą pridėk numeriuotu įrašu; priimtų
įrašų istorijos neperrašyk — pakeitimą fiksuok nauju įrašu.

## ADR-001 — Desktop: Electron + React + TypeScript

- **Data:** 2026-11-25
- **Būsena:** Priimta
- **Kontekstas:** Reikia „Windows“ programos, kurioje darbuotojas pasirenka ir importuoja
  Excel failą. Vartotojo sutartas stack: Electron, React, TypeScript.
- **Sprendimas:** `apps/desktop` su Electron, React ir TypeScript; build'inimui naudojamas
  electron-vite (Vite + electron-builder ne šiame etape).
- **Pasekmės:** UI kuriamas React komponentais; Electron main/preload atskirti nuo
  rendererio. Programos pakavimas į installerį — vėlesnis etapas.

## ADR-002 — API ir duomenys: TypeScript + Prisma + PostgreSQL

- **Data:** 2026-11-25
- **Būsena:** Priimta
- **Kontekstas:** Importo rezultatai turi būti saugomi bendroje duomenų bazėje, kad juos
  matytų keli klientai.
- **Sprendimas:** `apps/api` — TypeScript API (Fastify) su Prisma ORM; duomenų bazė —
  PostgreSQL per `DATABASE_URL`.
- **Pasekmės:** Klientas su DB nesijungia; visi duomenys eina per API. Skeletas DB
  neprisijungia ir `/health` nepriklauso nuo DB. Migracijos ir pilnas modelis — gavus
  Excel pavyzdį.

## ADR-003 — Monorepo ir ES moduliai

- **Data:** 2026-11-25
- **Būsena:** Priimta
- **Kontekstas:** Klientas ir API turi atskirus build'us, bet bendrą repo ir komandas.
- **Sprendimas:** npm workspaces monorepo (`apps/desktop`, `apps/api`). Šaltinis rašomas
  ES moduliais. API paleidžiama kaip ESM (`"type": "module"`). Electron main/preload
  bundlinami į CJS, nes sandboxintas preload ir Electron main įkėlimas su CJS yra
  patikimiausi; tai build'o detalė, o ne šaltinio stilius.
- **Pasekmės:** Vienos komandos iš repo šaknies; atskiri `package.json` kiekvienam
  paketui. Būsimas bendras kodas keliamas į `packages/*`.

## ADR-004 — Konfigūruojamas API adresas

- **Data:** 2026-11-25
- **Būsena:** Priimta
- **Kontekstas:** Klientas turi jungtis prie skirtingo API adreso (lokaliai, testų, vėliau
  Contabo aplinkoje).
- **Sprendimas:** Electron main procesas skaito `GOODS_IMPORT_API_URL`; numatyta reikšmė
  `http://127.0.0.1:3001`. Reikšmė perduodama rendereriui per preload (`contextBridge`),
  o UI ją parodo. Adresas neįrašytas į rendererio kodą.
- **Pasekmės:** Adresą galima pakeisti paleidžiant programą be perkompiliavimo. Vėliau
  galima pridėti nustatymų ekraną, bet jis nėra šio etapo dalis.

## ADR-005 — Excel importo tvarka ir pavyzdys

- **Data:** 2026-11-25
- **Būsena:** Priimta (įgyvendinimas atidėtas)
- **Kontekstas:** Importuojamas vienas sutarto formato tiekėjo pakavimo sąrašas. Kol kas
  neturime originalaus tiekėjo `.xlsx` failo, todėl lapo pavadinimas, stulpeliai ir
  eilučių skaičius dar nenustatyti. BRIO importo šablonas skirtas kitam etapui.
- **Sprendimas:**
  - Visas failas validuojamas prieš įrašymą, o importas ir eilutės įrašomi viena DB
    operacija (transakcija). Klaidos atveju bazėje nelieka dalinio importo.
  - Trūkstamo privalomo stulpelio klaida nurodo stulpelio pavadinimą.
  - Netinkamos reikšmės klaida nurodo Excel eilutę, stulpelį ir priežastį.
  - Barkodas saugomas kaip tekstas (`String`), kad išliktų priekiniai nuliai; kaina —
    `Decimal`.
  - Importo endpointai ir Excel skaitymas neįgyvendinami tol, kol nėra pavyzdžio ir
    atskiro patvirtinimo.
- **Pasekmės:** 2 etapas blokuotas iki pavyzdžio. `prisma/schema.prisma` modeliai laikini
  ir bus patikslinti pagal realius stulpelius.

## ADR-006 — Electron 44.11.5 fiksuota versija

- **Data:** 2026-11-25
- **Būsena:** Priimta
- **Kontekstas:** Darbo mašina naudoja Windows 11 26300. Electron 33.4.11 ir 38.8.6
  nulūžta paleidžiant (`0xc0000005`), Electron 45.5.0 pakimba; DSH pats naudoja
  Electron 44.11.5 ir veikia šioje aplinkoje.
- **Sprendimas:** `apps/desktop` priklausomybėje fiksuota `electron: "44.11.5"` (be `^`).
  Electron 44 npm pakete nėra `postinstall`, todėl šaknies `postinstall` paleidžia
  `scripts/ensure-electron.mjs`, kuris atsiunčia binary, jei jo nėra.
- **Pasekmės:** Versijos keitimas turi būti testuojamas šioje OS; nekelkite Electron
  automatiškai. Aplinkos specifika (Low integrity label, `ELECTRON_RUN_AS_NODE`)
  dokumentuota [environment.md](environment.md), ne app kode.

