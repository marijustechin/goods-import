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

## ADR-007 — Importų ir prekių duomenų modelis

- **Data:** 2026-11-25
- **Būsena:** Priimta (žmogaus paskirta 004 užduotis)
- **Kontekstas:** Originalus tiekėjo Excel pavyzdys jau gautas. Ankstesnis vieno konkretaus
  formato importo planas keičiamas universaliu importu, kuriame naudotojas pasirenka
  šaltinio ir DB laukų susiejimą. Importai ir importuotos prekės saugomi PostgreSQL per
  Prisma.
- **Sprendimas:**
  - `imports` lentelė (Prisma `Import`): UUID `id`, unikalus `import_number`, `name`,
    `filename`, `imported_at`, `row_count` ir privalomas `field_mapping` (`JSONB`).
  - `goods` lentelė (Prisma `Good`): UUID `id`, UUID `import_id` FK, `source_code`,
    neprivalomas `original_barcode`, `quantity`, neprivaloma `source_retail_price`,
    neprivalomas `image_url`, `created_at`, `updated_at` bei eksportuojami laukai.
  - Vienas importas turi daug prekių. Vieno importo ribose `source_code` yra unikalus:
    `@@unique([importId, sourceCode])`. Pasikartojančių šaltinio kodų kiekiai bus
    sumuojami importavimo metu.
  - Indeksai prekių paieškai: `import_id` ir `original_barcode`.
  - Kodai, barkodai ir muitinės kodai saugomi kaip tekstas (`String`). Kainos —
    `Decimal(12,2)`, svoriai — `Decimal(12,3)`.
  - `barcode` yra unikalus, bet neprivalomas; PostgreSQL leidžia kelias `NULL` reikšmes.
  - Importo ištrynimas neturi automatiškai ištrinti prekių: FK ryšys naudoja
    `onDelete: Restrict`.
  - Prisma modeliai ir laukai — camelCase; fizinės lentelės ir stulpeliai — snake_case
    per `@@map` / `@map`.
- **Pasekmės ir apribojimai:**
  - Šiame etape tik schema; migracijos nevykdomos, DB duomenys netrinami.
  - Ankstesni laikini modeliai `ImportBatch` / `ImportRow` pakeisti schema, bet jokia
    migracija nevykdyta.
  - Excel skaitymas, importo logika, API, barkodų generavimas, importo numerių
    generavimas, kainodara ir eksportas — vėlesnės užduotys.
  - `field_mapping` struktūra saugoma `JSONB`, bet DB lygmenyje nėra schemos validacijos.
  - `row_count` — šaltinio eilučių skaičius prieš grupavimą.
  - Istoriniai ADR įrašai, įskaitant ADR-005, neperrašomi; šis ADR fiksuoja pasikeitusią
    prielaidą apie gautą pavyzdį ir universalų susiejimą.

