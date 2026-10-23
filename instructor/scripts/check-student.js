import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Служебная проверка ведущего. Учебная функция и её импорты не меняются.
const instructorDir = fileURLToPath(new URL('../', import.meta.url));
const studentSource = new URL('../../student/src/calculateDelivery.js', import.meta.url);
const require = createRequire(import.meta.url);
const vitestCli = join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs');
const temporaryDir = mkdtempSync(join(instructorDir, '.student-check-'));
let exitCode = 1;

try {
  cpSync(join(instructorDir, 'vitest.config.js'), join(temporaryDir, 'vitest.config.js'));
  cpSync(join(instructorDir, 'test'), join(temporaryDir, 'test'), { recursive: true });
  cpSync(studentSource, join(temporaryDir, 'src/calculateDelivery.js'));
  writeFileSync(join(temporaryDir, 'package.json'), '{"type":"module"}\n');

  console.log('Полный набор тестов против student/. До исправлений ожидаются падения.');
  const result = spawnSync(process.execPath, [
    vitestCli, 'run', '--root', temporaryDir, ...process.argv.slice(2),
  ], { cwd: instructorDir, stdio: 'inherit' });

  if (result.error) throw result.error;
  exitCode = result.status ?? 1;
} finally {
  rmSync(temporaryDir, { recursive: true, force: true });
}

// Сохраняем обычный смысл кода выхода: 1 — красные тесты, 0 — зелёные.
process.exitCode = exitCode;
