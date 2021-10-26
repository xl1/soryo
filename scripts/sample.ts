import * as fs from 'fs/promises';
import { join as pathJoin } from 'path'

const p = (path: string) => pathJoin(__dirname, path);

async function* loadCsv(path: string): AsyncIterable<string[]> {
    const content = await fs.readFile(path, { encoding: 'utf-8' });
    for (const line of content.split('\n')) {
        yield line.split(',');
    }
}

function random<T>(array: T[]): T {
    return array[Math.random() * array.length | 0];
}

function katakanaToHiragana(value: string): string {
    return [...value]
        .map(c => String.fromCharCode(c.charCodeAt(0) - 0x60))
        .join('');
}

export function sample(joyokanji: Map<string, string[]>, word: string, kana: string): string | undefined {
    if (word.length !== 2 || word.includes('々')) return;

    let kanjiYomi = joyokanji.get(word[0]) || [];
    for (const k of kanjiYomi) {
        if (kana.startsWith(k)) {
            return katakanaToHiragana(k) + word.substring(1);
        }
    }

    kanjiYomi = joyokanji.get(word[word.length - 1]) || [];
    for (const k of kanjiYomi) {
        if (kana.endsWith(k)) {
            return word.substring(0, word.length - 1) + katakanaToHiragana(k);
        }
    }
}

async function main() {
    const joyokanji = new Map<string, string[]>();
    for await (const [kanji, ...yomi] of loadCsv(p('../joyokanji.csv'))) {
        joyokanji.set(kanji, yomi);
    }

    const csv = await fs.readFile(p('../dic.csv'), { encoding: 'utf-8' });
    const candidates = csv.split('\n');

    while (true) {
        const [word, kana] = random(candidates).split(',');
        if (word && kana) {
            const x = sample(joyokanji, word, kana);
            if (x) {
                console.log(x);
                return;
            }
        }
    }
}

main().catch(console.error);
