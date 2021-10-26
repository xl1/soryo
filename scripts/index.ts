import { Context } from '@azure/functions';
import Twitter from 'twitter';
import { init, sample } from './sample';

const waitInit = init();
const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY!,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET!,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

export default async function(context: Context) {
    const [joyokanji, candidates] = await waitInit;
    const status = sample(joyokanji, candidates);
    await client.post('statuses/update', { status });
}
