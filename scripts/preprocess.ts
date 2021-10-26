import * as fs from 'fs/promises';
import { join as pathJoin } from 'path'

const p = (path: string) => pathJoin(__dirname, path);

async function* loadCsv(path: string): AsyncIterable<string[]> {
    const content = await fs.readFile(path, { encoding: 'utf-8' });
    for (const line of content.split('\n')) {
        yield line.split(',');
    }
}

async function main() {
    const joyokanji = new Set<string>();
    for await (const [kanji] of loadCsv(p('../joyokanji.csv'))) {
        joyokanji.add(kanji);
    }

    const containsJoyoKanji = (word: string) => [...word].some(c => joyokanji.has(c));
    const onlyJoyoKanji = (word: string) => [...word].every(c => joyokanji.has(c));
    const kanaRegex = /[ぁ-んァ-ン０-９]/;
    const containsKana = (word: string) => kanaRegex.test(word);
    
    const outputFile = await fs.open(p('../dic.csv'), 'w');
    for (const name of await fs.readdir(p('../dic'))) {
        for await (const xs of loadCsv(p(`../dic/${name}`))) {
            if (xs.length <= 11) break;
            const word = xs[0];
            const kana = xs[11];
            if (containsJoyoKanji(word) && !onlyJoyoKanji(word) && !containsKana(word)) {
                await outputFile.write(`${word},${kana}\n`);
            }
        }
    }
    await outputFile.close();
}

main().catch(console.error);
