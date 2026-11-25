# 003 — Darbo protokolo suderinimas

- **Būsena:** DONE
- **Data:** 2026-11-25
- **Priimta:** 2026-11-25
- **Tipas:** dokumentacijos suderinimo užduotis

## Tikslas

Pašalinti prieštaravimus tarp ankstesnių `AGENTS.md` taisyklių ir `Agent Execution Policy
v1.0`.

## Reikalavimai

1. `AGENTS.md` patikros taisyklės suderintos su vykdymo politika: kiekvienai užduočiai
   atliekama tik joje nurodyta privaloma patikra; universalaus `build`, API ir GUI
   reikalavimo nėra.
2. Aplinkos problemų dokumentavimas nesuteikia teisės savarankiškai keisti aplinkos; tam
   reikia atskiro aiškaus žmogaus leidimo.
3. Architektūrinius sprendimus agentas gali siūlyti, bet ADR statusas „Priimta“ — tik su
   žmogaus patvirtinimu.
4. Užduočių registre aktyvi užduotis yra tik žmogaus aiškiai paskirta; `READY_FOR_HUMAN_REVIEW`
   nėra aktyvi; į `DONE` pereina tik žmogus; agentas nepradeda kitos užduoties.

## Apimtis

- `AGENTS.md`
- `docs/tasks/README.md`
- Šis 003 užduoties įrašas

## Ne apimtis

- Programos kodas, build, typecheck, API ir GUI patikros.
- Ankstesnių užduočių ir ADR istorijos keitimas.
- OS, ACL, saugumo politikos ar agento runtime keitimai.

## Darbai

- [x] Užfiksuota pradinė Git būsena (`HEAD 0c3ebcf`).
- [x] Suderintos `AGENTS.md` patikros, aplinkos ir ADR taisyklės.
- [x] Pakeista aktyvios užduoties taisyklė `docs/tasks/README.md`.
- [x] Įregistruotas šis 003 užduoties įrašas.
- [x] Dokumentacijos pakeitimų diff peržiūra.

## Priėmimo kriterijai

- [x] `AGENTS.md` nebeliko universalaus `build`/API/GUI patikros reikalavimo.
- [x] Aplinkos keitimui reikalingas atskiras žmogaus leidimas.
- [x] ADR „Priimta“ statusas siejamas su žmogaus patvirtinimu.
- [x] Registro aktyvios užduoties taisyklė atitinka 4 reikalavimą.
- [x] Dokumentacijos diff peržiūrėtas; prieštaravimų neliko.

## Patikros rezultatas

Atlikta dokumentacijos diff peržiūra (`AGENTS.md` ir `docs/tasks/README.md` prieš 003
pakeitimus). Patvirtinta:

- `AGENTS.md` 4 dalyje neliko universalaus typecheck/build/API/GUI reikalavimo;
- aplinkos keitimui reikalingas atskiras aiškus žmogaus leidimas;
- ADR „Priimta“ susietas su žmogaus patvirtinimu;
- registro aktyvios užduoties taisyklė atitinka 4 reikalavimą.

Build, typecheck, API ir GUI patikros neatliktos pagal užduoties sąlygą.

## Konfliktų šalinimas

| Ankstesnė taisyklė | Nauja taisyklė |
| --- | --- |
| `AGENTS.md` reikalavo visada atlikti typecheck, build, API ir GUI | Atliekama tik užduotyje nurodyta privaloma patikra |
| Aplinkos taisymai buvo dokumentuojami kaip įprasta praktika | Aplinkos keitimui reikia atskiro aiškaus žmogaus leidimo |
| ADR statusas galėjo būti suteiktas agento sprendimu | „Priimta“ — tik su žmogaus patvirtinimu |
| Aktyvi užduotis buvo pirmoji TODO/IN_PROGRESS/READY | Aktyvi — tik žmogaus paskirta; READY nėra aktyvi |

## Ataskaita žmogui

Užduotis baigta ir priimta 2026-11-25.
