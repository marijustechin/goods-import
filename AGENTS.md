# AGENTS.md — agento darbo tvarka

Šis failas skirtas agentams. Žmogaus dokumentacija — [README.md](README.md), sprendimai —
[docs/decisions.md](docs/decisions.md), aplinkos spąstai — [docs/environment.md](docs/environment.md).

## 1. Prieš pradedant

1. Perskaityk [README.md](README.md) ir [docs/decisions.md](docs/decisions.md).
2. Aktyvi užduotis yra tik ta, kurią žmogus aiškiai paskyrė vykdyti. `READY_FOR_HUMAN_REVIEW`
   nėra aktyviai vykdoma; agentas savarankiškai nepradeda kitos užduoties.
3. Dirbk tik su paskirta užduotimi ir neplėsk jos apimties.

## 2. Technologijų rinkinys

- **Desktop:** Electron 44.11.5 (fiksuota) + React + TypeScript, `apps/desktop`
  (electron-vite). Versijos nekelk be atskiro aiškaus žmogaus leidimo — žr. ADR-006.
- **API:** TypeScript + Fastify + Prisma, `apps/api`; duomenų bazė — PostgreSQL.
- **Monorepo:** npm workspaces, Node.js >= 20.
- **Moduliai:** šaltinis rašomas ES moduliais (`import`/`export`). API paleidžiama kaip
  ESM; Electron main/preload bundlinami į CJS, nes taip patikimai veikia sandboxintas
  preload.
- **API adresas:** klientas jį gauna iš `GOODS_IMPORT_API_URL` (numatyta
  `http://127.0.0.1:3001`) per main → preload → renderer.

## 3. Komandos

Iš repo šaknies, Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run typecheck
npm.cmd run build
npm.cmd run dev:api
npm.cmd run dev:desktop
```

`cmd.exe`, Linux ir macOS atveju vietoje `npm.cmd` rašykite `npm`. PowerShell blokuoja
`npm.ps1`, todėl instrukcijose naudojamas `npm.cmd`.

`npm.cmd install` paleidžia `postinstall` → `scripts/ensure-electron.mjs`, kuris atsiunčia
Electron binary. Jei npm užblokuoja dependency scriptus:
`npm.cmd install-scripts approve --all`, tada `npm.cmd install` dar kartą.

DSH agento shell'e GUI patikrai gali prireikti pašalinti `ELECTRON_RUN_AS_NODE`. Toks
aplinkos pakeitimas atliekamas tik gavus atskirą aiškų žmogaus leidimą; be jo — pranešti
kliūtį (žr. [docs/environment.md](docs/environment.md)).

## 4. Patikra ir READY_FOR_HUMAN_REVIEW

- Kiekvienai užduočiai atliekama tik jos faile aiškiai nurodyta privaloma patikra.
  Universalaus reikalavimo visada atlikti `build`, API ar GUI patikras nėra.
- Jei užduotis numato patikros komandą, naudojama viena aiškiai apibrėžta komanda ir jos
  faktinė išvestis įrašoma užduoties faile.
- `READY_FOR_HUMAN_REVIEW` reiškia baigtą, žmogaus peržiūros laukiančią užduotį; ji nėra
  aktyviai vykdoma ir agentas savarankiškai nepradeda kitos užduoties.
- `DONE` žymi tik žmogus po priėmimo. `BLOCKED` naudojamas, kai yra konkreti kliūtis,
  kurios negalima pašalinti be žmogaus.
- Aplinkos problemų dokumentavimas (`docs/environment.md`) nesuteikia teisės savarankiškai
  keisti aplinkos. OS, ACL, saugumo politikos, globalių konfigūracijų ar agento runtime
  keitimai galimi tik gavus atskirą aiškų žmogaus leidimą.

## 5. Ataskaitos formatas

- Ką pakeista.
- Patikros komanda ir faktinė išvestis.
- Ką tai patvirtina.
- Atviros kliūtys (pvz., trūkstamas Excel pavyzdys).

## 6. Ribos

- Jokių verslo funkcijų be užduoties. Šiuo metu Excel importo logikos dar nėra.
- Necommit'ink `node_modules/`, `out/`, `dist/` ar `.env`; nerašyk paslapčių.
- Electron: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`. Saugumo
  nuostatų nekeisk be pagrįstos priežasties.
- Excel lapo, stulpelių ir eilučių skaičiaus nefiksuok be originalaus tiekėjo failo.
- PostgreSQL migracijas ir importo sandorį kurk tik pagal užduotį ir sutartą pavyzdį.
- Architektūrinius sprendimus agentas gali siūlyti, tačiau ADR statusas „Priimta“
  suteikiamas tik gavus žmogaus patvirtinimą.

## Agent Execution Policy v1.0

### Roles and authority

- The human and the project architect define requirements, architecture, scope and acceptance criteria.
- The implementation agent executes assigned tasks.
- The agent may decide HOW to implement an approved requirement, but must not independently decide WHAT additional work should be implemented.

### Scope control

- Implement only explicitly assigned requirements.
- Make the smallest sufficient set of changes.
- Do not introduce speculative improvements.
- Do not refactor unrelated code.
- Do not add features that were not requested.
- Do not change architecture, dependency versions or technology choices without explicit approval.
- Do not modify files outside the project.
- Do not modify operating system settings, permissions, ACLs, security policies, global configurations or agent runtime configurations.
- Report unrelated problems instead of fixing them.
- Preserve existing uncommitted changes.

### Diagnostic budget

- Perform no more than three focused diagnostic attempts per blocker.
- If the blocker persists, stop and report BLOCKED.
- If solving a problem requires exceeding the assigned scope, stop immediately, regardless of the remaining diagnostic budget.
- Do not repeatedly attempt equivalent solutions.
- Distinguish confirmed facts from hypotheses.
- Never present an unverified hypothesis as a confirmed root cause.

### Verification

- Execute only the verification required by the assigned task.
- Use one explicitly defined proof command.
- Do not perform additional verification simply because it is possible.
- If verification requires human interaction or environment modification, report the blocker.
- Never claim successful verification without evidence.

### Completion

- Stop immediately after satisfying the acceptance criteria.
- Do not continue searching for additional improvements.
- Do not commit changes unless explicitly instructed.
- Report the outcome as READY_FOR_HUMAN_REVIEW or BLOCKED.

