import { Context } from '@azure/functions';
import { TwitterApi } from 'twitter-api-v2';
import { init, sample } from './sample';

const waitInit = init();
const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY!,
    appSecret: process.env.TWITTER_CONSUMER_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_KEY!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
}).v2;

export default async function(context: Context) {
    console.log('invoked');
    const [joyokanji, candidates] = await waitInit;
    const status = sample(joyokanji, candidates);
    await client.tweet(status);
}
