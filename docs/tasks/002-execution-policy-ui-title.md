# 002 — Vykdymo protokolas ir minimalus antraštės pakeitimas

- **Būsena:** DONE
- **Data:** 2026-11-25
- **Priimta:** 2026-11-25
- **Tipas:** dokumentacijos ir minimalaus UI pakeitimo užduotis

## Tikslas

Papildyti `AGENTS.md` agento vykdymo protokolu „Agent Execution Policy v1.0“ ir pakeisti
pagrindinio Electron lango antraštę iš „Pakavimo sąrašo importas“ į „Prekių importas“.

## Apimtis

- `AGENTS.md` — pridėtas `## Agent Execution Policy v1.0` skyrius; esamas turinys
  nepakeistas.
- `apps/desktop/src/renderer/src/App.tsx` — pakeistas tik `<h1>` tekstas.
- `docs/tasks/README.md` ir šis failas — užduoties registracija.

## Ne apimtis

- Lango pavadinimas, dizainas, komponentų struktūra, stiliai, mygtukai, priklausomybės.
- Electron paleidimas, build, API ar papildomi testai.
- Bet kokie OS, ACL, saugumo politikos ar agento runtime pakeitimai.

## Darbai

- [x] Užfiksuota pradinė Git working tree būsena (`HEAD 0c3ebcf`).
- [x] Į `AGENTS.md` įtrauktas vykdymo protokolas.
- [x] Pakeista pagrindinio lango antraštė.
- [x] Užduotis įregistruota esamoje `docs/tasks/` struktūroje.
- [x] Įvykdyta vienintelė privaloma patikra.

## Priėmimo kriterijai

- [x] `AGENTS.md` turi naują `Agent Execution Policy v1.0` skyrių, esamas turinys išlikęs.
- [x] Pagrindiniame lange rodoma „Prekių importas“.
- [x] Nekeistas lango pavadinimas, stilius, mygtukai, struktūra ar priklausomybės.
- [x] Užduotis įrašyta į `docs/tasks/README.md`.
- [x] `npm.cmd run typecheck` baigėsi kodu 0.

## Patikros rezultatas

Komanda:

```powershell
npm.cmd run typecheck
```

Rezultatas: `TYPECHECK_EXIT=0`. Abu workspace TypeScript patikros (`tsc --noEmit`) praėjo.

## Konfliktai su esamomis AGENTS.md taisyklėmis

1. Esama `AGENTS.md` 4 dalis reikalauja prieš `READY_FOR_HUMAN_REVIEW` atlikti
   `typecheck`, `build`, API `/health` ir GUI patikrą. Ši užduotis leidžia tik
   `npm.cmd run typecheck` ir draudžia paleisti Electron. Vykdyta konkretesnė užduoties
   instrukcija; konfliktas užfiksuotas čia ir ataskaitoje.
2. Esama `AGENTS.md` 4 dalis numato, kad DSH/Windows aplinkos taisymai dokumentuojami
   `docs/environment.md`, o naujoji politika draudžia keisti OS nustatymus, ACL,
   saugumo politiką ir agento runtime. Šioje užduotyje aplinka nebuvo keičiama.

## Ataskaita žmogui

Antraštė pakeista minimaliai, protokolas pridėtas, užduotis įregistruota. Vienintelė
patikra praėjo. Papildomi darbai neatlikti. Užduotis priimta 2026-11-25.
