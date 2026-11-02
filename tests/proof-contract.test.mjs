import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicCase } from '../src/lib/publicCase.mjs';
test('checked-in case studies use actual local image assets and valid public fields', async () => {
  const cases = JSON.parse(await readFile(new URL('../src/data/workExamples.json', import.meta.url)));
  const slugs = new Set();
  for (const record of cases) {
    const item = publicCase(record);
    assert(!slugs.has(item.slug)); slugs.add(item.slug);
    for (const url of [item.beforeImage, item.afterImage].filter(Boolean)) {
      const path = new URL(url).pathname;
      await readFile(new URL(`../public${path}`, import.meta.url));
    }
  }
});
