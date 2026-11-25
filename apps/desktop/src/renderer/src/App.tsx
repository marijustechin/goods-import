import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import type { ExcelSheetAnalysis } from '../../shared/excel';

const apiBaseUrl = window.goodsImport?.apiBaseUrl ?? 'http://127.0.0.1:3001';

export default function App() {
  const [analysis, setAnalysis] = useState<ExcelSheetAnalysis | null>(null);
  const [headerRowInput, setHeaderRowInput] = useState('1');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function requestAnalysis(sheetName: string, headerValue: string): Promise<void> {
    const api = window.goodsImport;
    if (!api) {
      setError('Programos API nepasiekiama.');
      return;
    }

    const headerRow = Number(headerValue);
    if (!Number.isInteger(headerRow) || headerRow < 1) {
      setError('Antraščių eilutė turi būti teigiamas sveikasis skaičius.');
      return;
    }

    setIsBusy(true);

    try {
      const result = await api.analyzeExcelSheet({ sheetName, headerRow });

      if (result.status === 'canceled') return;
      if (result.status === 'error') {
        setError(result.message);
        if (analysis) setHeaderRowInput(String(analysis.headerRow));
        return;
      }

      setError('');
      setAnalysis(result.data);
      setHeaderRowInput(String(result.data.headerRow));
    } catch {
      setError('Nepavyko perskaityti Excel failo struktūros.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSelectFile(): Promise<void> {
    const api = window.goodsImport;
    if (!api) {
      setError('Programos API nepasiekiama.');
      return;
    }

    setIsBusy(true);

    try {
      const result = await api.selectExcelFile();

      if (result.status === 'canceled') return;
      if (result.status === 'error') {
        setError(result.message);
        return;
      }

      setError('');
      setAnalysis(result.data);
      setHeaderRowInput(String(result.data.headerRow));
    } catch {
      setError('Nepavyko atidaryti Excel failo.');
    } finally {
      setIsBusy(false);
    }
  }

  function handleSheetChange(event: ChangeEvent<HTMLSelectElement>): void {
    void requestAnalysis(event.target.value, headerRowInput);
  }

  function handleAnalyze(): void {
    if (!analysis) return;
    void requestAnalysis(analysis.sheetName, headerRowInput);
  }

  function handleHeaderRowKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleAnalyze();
  }

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
            <span className="step">{analysis ? 'Nuskaityta' : 'Pasiruošta'}</span>
          </div>

          <p className="muted">
            Pasirinkite tiekėjo .xlsx failą ir patikrinkite jo lapų bei stulpelių struktūrą.
          </p>

          <div className="actions">
            <button
              type="button"
              onClick={() => {
                void handleSelectFile();
              }}
              disabled={isBusy}
            >
              Pasirinkti .xlsx
            </button>
            <button type="button" className="primary" disabled>
              Importuoti
            </button>
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {analysis && (
            <div className="excel-controls">
              <label className="field">
                <span>Lapas</span>
                <select value={analysis.sheetName} onChange={handleSheetChange} disabled={isBusy}>
                  {analysis.sheetNames.map((sheetName) => (
                    <option key={sheetName} value={sheetName}>
                      {sheetName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Antraščių eilutė</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={headerRowInput}
                  onChange={(event) => setHeaderRowInput(event.target.value)}
                  onKeyDown={handleHeaderRowKeyDown}
                  disabled={isBusy}
                />
              </label>

              <button type="button" onClick={handleAnalyze} disabled={isBusy}>
                Atnaujinti
              </button>
            </div>
          )}

          <dl className="summary">
            <div>
              <dt>Failas</dt>
              <dd>{analysis?.fileName ?? '—'}</dd>
            </div>
            <div>
              <dt>Lapas</dt>
              <dd>{analysis?.sheetName ?? '—'}</dd>
            </div>
            <div>
              <dt>Antraščių eilutė</dt>
              <dd>{analysis?.headerRow ?? '—'}</dd>
            </div>
            <div>
              <dt>Stulpeliai</dt>
              <dd>{analysis?.columns.length ?? '—'}</dd>
            </div>
            <div>
              <dt>Duomenų eilutės</dt>
              <dd>{analysis?.dataRowCount ?? '—'}</dd>
            </div>
          </dl>

          {analysis && (
            <div className="preview">
              <div className="card-heading">
                <h2>Duomenų peržiūra</h2>
                <span className="step">{analysis.previewRows.length} / 5 eilučių</span>
              </div>

              {analysis.previewRows.length > 0 ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {analysis.columns.map((column) => (
                          <th key={column.position} title={`Excel stulpelis ${column.letter}`}>
                            {column.title ?? `(be pavadinimo, ${column.letter})`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.previewRows.map((row) => (
                        <tr key={row.rowNumber}>
                          {row.cells.map((cell, index) => {
                            const column = analysis.columns[index];
                            return <td key={column?.position ?? index}>{cell}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="hint">Duomenų eilučių nėra.</p>
              )}
            </div>
          )}

          <p className="hint">
            Importavimo logika dar neįgyvendinta. Šiame etape tik nuskaitoma failo struktūra.
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
