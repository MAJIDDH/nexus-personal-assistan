import { useState } from 'react';
import { NeuralField } from './components/nexus/NeuralField';
import { ModuleNodes } from './components/nexus/ModuleNodes';
import { NavRail, TopBar, ContextPanel, CommandBar } from './components/nexus/Shell';
import type { ModuleId } from './lib/modules';

export default function App() {
  const [active, setActive] = useState<ModuleId>('assistant');
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <NavRail active={active} onSelect={setActive} />
      <main className="relative flex flex-1 flex-col">
        <NeuralField className="absolute inset-0 h-full w-full" />
        <TopBar />
        <div className="relative flex-1">
          <ModuleNodes active={active} onOpen={setActive} />
        </div>
        <ContextPanel active={active} onClose={() => setActive('assistant')} />
        <CommandBar />
      </main>
    </div>
  );
}
