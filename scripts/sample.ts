import * as fs from 'fs/promises';
import { join as pathJoin } from 'path'

const p = (path: string) => pathJoin(__dirname, path);

function random<T>(array: T[]): T {
    return array[Math.random() * array.length | 0];
}

function katakanaToHiragana(value: string): string {
    return [...value]
        .map(c => String.fromCharCode(c.charCodeAt(0) - 0x60))
        .join('');
}

export async function init(): Promise<[Map<string, string[]>, string[]]> {
    const joyokanji = new Map<string, string[]>();
    const content = await fs.readFile(p('../joyokanji.csv'), { encoding: 'utf-8' });
    for (const line of content.split('\n')) {
        const [kanji, ...yomi] = line.split(',');
        joyokanji.set(kanji, yomi);
    }

    const csv = await fs.readFile(p('../dic.csv'), { encoding: 'utf-8' });
    const candidates = csv.split('\n');

    return [joyokanji, candidates];
}

export function sample(joyokanji: Map<string, string[]>, candidates: string[]): string {
    while (true) {
        const [word, kana] = random(candidates).split(',');
        if (word && kana) {
            if (word.length !== 2 || word.includes('々')) continue;

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
    }
}

async function main() {
    const [joyokanji, candidates] = await init();
    console.log(sample(joyokanji, candidates));
}

if (require.main === module) {
    main().catch(console.error);
}
