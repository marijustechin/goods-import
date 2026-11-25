# Užduočių registras

Atnaujinta: 2026-11-25

| ID  | Užduotis                                                          | Būsena                            | Failas                                                              |
| --- | ----------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| 001 | Projekto darbo tvarka, programos skeletas ir pirmas Excel importas | 1 etapas DONE; 2 etapas pakeistas ADR-007 | [001-project-harness-skeleton.md](001-project-harness-skeleton.md) |
| 002 | Vykdymo protokolas ir minimalus antraštės pakeitimas | DONE | [002-execution-policy-ui-title.md](002-execution-policy-ui-title.md) |
| 003 | Darbo protokolo suderinimas | DONE | [003-work-protocol-alignment.md](003-work-protocol-alignment.md) |
| 004 | Duomenų bazės modeliai | DONE | [004-database-models.md](004-database-models.md) |

> 001 antro etapo senasis planas pakeistas universaliu Excel importavimu pagal ADR-007.
> Originalus tiekėjo Excel pavyzdys jau gautas. Istorinis 001 užduoties įrašas nekeistas.

Būsenos: `TODO` → `IN_PROGRESS` → `READY_FOR_HUMAN_REVIEW` → `DONE`; `BLOCKED` — kai yra
konkreti kliūtis, kurios negalima pašalinti be žmogaus.

Aktyvi užduotis yra tik ta, kurią žmogus aiškiai paskyrė vykdyti. `READY_FOR_HUMAN_REVIEW`
nėra aktyviai vykdoma; agentas savarankiškai nepradeda kitos užduoties. Tik žmogus
patvirtina perėjimą į `DONE`. Baigtos užduotys iš registro neištrinamos, tik keičiama
būsena.
