import './styles.css';

/**
 * NEXUS main UI is the original Lovable prototype, embedded without restyling
 * or merging it with the legacy dashboard. The prototype's module data/actions
 * remain demo-only until they are wired to the API in a separate integration.
 */
export default function App() {
  return (
    <main className="lovable-root" aria-label="NEXUS Lovable interface">
      <iframe
        className="lovable-frame"
        src="https://id-preview--2bf607a0-3025-421d-812b-8fa3da10b44e.lovable.app/"
        title="NEXUS — رابط اصلی طراحی‌شده در Lovable"
        allow="clipboard-read; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </main>
  );
}
