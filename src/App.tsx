import { MagicalText } from '@/components/magical-text';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { Table } from '@/components/table';

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="border-b-2 py-3">
        <div className="mx-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <MagicalText text="Tabletastic" />
          </h1>

          <ModeToggle />
        </div>
      </div>

      <div className="relative h-full pb-4">
        <Table />
      </div>
    </ThemeProvider>
  );
}
