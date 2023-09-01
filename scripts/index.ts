import { Context } from '@azure/functions';
import { TwitterApi } from 'twitter-api-v2';
import { init, sample } from './sample';

const waitInit = init();
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!).v2;

export default async function(context: Context) {
    console.log('invoked');
    const [joyokanji, candidates] = await waitInit;
    const status = sample(joyokanji, candidates);
    await client.tweet(status);
}
