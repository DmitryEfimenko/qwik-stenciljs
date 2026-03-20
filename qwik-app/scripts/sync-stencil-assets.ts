import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

type CopyTarget = {
  label: string;
  source: string;
  destination: string;
};

const appRoot = process.cwd();

const targets: CopyTarget[] = [
  {
    label: 'Stencil ESM runtime',
    source: resolve(appRoot, '../stencil-js-lib/dist/esm'),
    destination: resolve(appRoot, 'public/stencil-runtime/esm'),
  },
  {
    label: 'Stencil hydrate runtime',
    source: resolve(appRoot, '../stencil-js-lib/hydrate'),
    destination: resolve(appRoot, 'public/stencil-runtime/hydrate'),
  },
];

function syncTarget(target: CopyTarget): void {
  if (!existsSync(target.source)) {
    throw new Error(
      `Missing source for ${target.label}: ${target.source}. Run stencil-js-lib build first.`,
    );
  }

  rmSync(target.destination, { recursive: true, force: true });
  mkdirSync(target.destination, { recursive: true });
  cpSync(target.source, target.destination, { recursive: true });

  console.log(
    `Synced ${target.label}: ${target.source} -> ${target.destination}`,
  );
}

for (const target of targets) {
  syncTarget(target);
}

console.log('Stencil runtime assets synced successfully.');
