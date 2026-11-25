# 004 — Duomenų bazės modeliai

- **Būsena:** DONE
- **Data:** 2026-11-25
- **Priimta:** 2026-11-25
- **Tipas:** Prisma duomenų modelių užduotis

## Tikslas

Sukurti Prisma modelius prekių importams ir importuotoms prekėms saugoti PostgreSQL
duomenų bazėje pagal 004 specifikaciją.

## Kontekstas

- Oficialus būsimo eksporto formatas — `GoodsImport_File_template.xlsx`.
- Originalus tiekėjo Excel pavyzdys jau gautas.
- Ankstesnį vieno konkretaus formato importo planą pakeičia universalus importas, kuriame
  naudotojas pasirenka šaltinio ir DB laukų susiejimą.

## Apimtis

- `apps/api/prisma/schema.prisma` — `Import` (`imports`) ir `Good` (`goods`) modeliai.
- `docs/decisions.md` — naujas ADR-007.
- `docs/tasks/README.md` ir šis užduoties įrašas.

## Ne apimtis

Excel skaitymas, importavimo logika, API endpointai, frontend, barkodų generavimas,
importo numerių generavimas, kainodara, etikečių spausdinimas, Excel eksportas, nuotraukų
atsisiuntimas, DB migracijų vykdymas.

## Darbai

- [x] Peržiūrėta esama laikina Prisma schema.
- [x] Sukurti `Import` ir `Good` modeliai su snake_case fiziniais pavadinimais.
- [x] Įgyvendinti UUID PK, unikalus, composite unique, indeksai ir `Restrict` FK.
- [x] Papildytas `docs/decisions.md` ADR-007.
- [x] Užregistruota 004 užduotis.
- [x] Įvykdyta `npm.cmd run prisma:validate` ir užfiksuotas rezultatas.

## Priėmimo kriterijai

- [x] `imports` turi visus specifikacijos laukus ir tipus; `import_number` unikalus,
  `field_mapping` — privalomas JSONB.
- [x] `goods` turi visus techninius, vidinius ir eksportuojamus laukus.
- [x] `goods.import_id` yra UUID FK; importo trynimas nepašalina prekių (`Restrict`).
- [x] `@@unique([importId, sourceCode])` ir indeksai `import_id`, `original_barcode`.
- [x] Kodai/barkodai/muitinės kodai — `String`; kainos `Decimal(12,2)`, svoriai
  `Decimal(12,3)`.
- [x] ADR-007 fiksuoja modelį, grupavimo principą, gautą pavyzdį ir universalų susiejimą.
- [x] `npm.cmd run prisma:validate` baigėsi kodu 0.

## Patikros rezultatas

Komanda:

```powershell
npm.cmd run prisma:validate
```

Rezultatas:

```text
Prisma schema loaded from prisma\schema.prisma
The schema at prisma\schema.prisma is valid 🚀
PRISMA_VALIDATE_EXIT=0
```

Papildomai `stderr` pranešta, kad įkelti `.env` kintamieji; schema validuota be klaidų.
Migracijos nevykdytos, prie DB neprisijungta.

## Galutinė Prisma schema

Šaltinis: `apps/api/prisma/schema.prisma`. Modeliai:

- `Import` → `imports`: UUID `id`, `import_number` (unique), `name`, `filename`,
  `imported_at`, `row_count`, `field_mapping` (`Json @db.JsonB`), `goods`.
- `Good` → `goods`: UUID `id`, UUID `import_id`, `source_code`, `original_barcode?`,
  `quantity`, `source_retail_price?`, `image_url?`, `created_at`, `updated_at`,
  eksportuojami laukai, `importRecord` FK su `onDelete: Restrict`,
  `@@unique([importId, sourceCode])`, `@@index([importId])`,
  `@@index([originalBarcode])`.

## Apribojimai

- Migracijos nevykdytos; esami DB duomenys neliesti.
- `field_mapping` JSONB struktūra DB lygmenyje nevaliduojama.
- `barcode` unikalus, bet neprivalomas; kelios `NULL` reikšmės leidžiamos.
- `row_count` — eilučių skaičius prieš grupavimą.
- Importo numerių generavimas, barkodų generavimas, Excel skaitymas, importo logika,
  API ir eksportas neįgyvendinti.
- Istorinis 001 2 etapo planas nekeičiamas; jį pakeičia šiame ADR fiksuotas universalus
  modelis.

## Ataskaita žmogui

Prisma schema ir ADR-007 patvirtinti 2026-11-25. `npm.cmd run prisma:validate` praėjo;
užduotis baigta.
