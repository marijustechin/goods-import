const apiBaseUrl = window.goodsImport?.apiBaseUrl ?? 'http://127.0.0.1:3001';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Goods Import</p>
          <h1>Prekių importas</h1>
        </div>
        <span className="badge">Skeletas</span>
      </header>

      <main className="layout">
        <section className="card">
          <div className="card-heading">
            <h2>1. Excel failas</h2>
            <span className="step">Pasiruošta</span>
          </div>

          <p className="muted">
            Pasirinkite tiekėjo pakavimo sąrašą (.xlsx) ir spauskite „Importuoti“.
          </p>

          <div className="actions">
            <button type="button" disabled>
              Pasirinkti .xlsx
            </button>
            <button type="button" className="primary" disabled>
              Importuoti
            </button>
          </div>

          <dl className="summary">
            <div>
              <dt>Failas</dt>
              <dd>—</dd>
            </div>
            <div>
              <dt>Išsaugota eilučių</dt>
              <dd>—</dd>
            </div>
          </dl>

          <p className="hint">
            Importo logika dar neįgyvendinta. Ji bus pridėta kitame etape, suderinus tiekėjo
            Excel pavyzdį, lapą ir stulpelius.
          </p>
        </section>

        <aside className="card side">
          <div className="card-heading">
            <h2>Ryšys</h2>
            <span className="step">API</span>
          </div>

          <p className="muted">Adresas nustatomas paleidžiant programą.</p>
          <code className="endpoint">{apiBaseUrl}</code>
          <p className="hint">
            Kintamasis <span className="mono">GOODS_IMPORT_API_URL</span>. Numatytas adresas
            naudojamas, jei kintamasis nenustatytas.
          </p>
        </aside>
      </main>

      <footer className="app-footer">
        <span>Electron + React + TypeScript</span>
        <span>API: TypeScript + Prisma</span>
      </footer>
    </div>
  );
}
