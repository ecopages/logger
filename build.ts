import { Logger } from './src/logger';

const appLogger = new Logger('[@ecopages/logger]');

async function buildLib() {
  const build = await Bun.build({
    entrypoints: ['./src/logger.ts'],
    outdir: 'dist',
    format: 'esm',
    minify: true,
  });

  if (!build.success) {
    for (const error of build.logs) {
      appLogger.error(error);
    }
  }
}

await buildLib();
