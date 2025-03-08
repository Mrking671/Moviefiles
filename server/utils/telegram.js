import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const session = new StringSession(process.env.TELEGRAM_SESSION || '');

const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

export async function connectTelegram() {
  await client.start({
    botAuthToken: process.env.TELEGRAM_BOT_TOKEN,
  });
  console.log('Telegram client connected');
}

export async function searchTelegramFiles(title) {
  try {
    const result = await client.invoke(
      new Api.messages.Search({
        peer: process.env.TELEGRAM_CHANNEL_ID,
        q: title,
        filter: new Api.InputMessagesFilterDocument(),
        limit: 50,
      })
    );

    return result.messages.map(msg => ({
      fileId: `${msg.media.document.id}_${msg.media.document.accessHash}`,
      quality: extractQuality(msg.message),
      size: Math.round(msg.media.document.size / 1048576), // MB
      caption: msg.message,
    }));
  } catch (error) {
    console.error('Telegram search error:', error);
    return [];
  }
}

export async function downloadTelegramFile(fileId) {
  const [id, accessHash] = fileId.split('_');
  
  const file = await client.downloadMedia(
    new Api.InputDocument({
      id: BigInt(id),
      accessHash: BigInt(accessHash),
      fileReference: new Uint8Array(),
    }),
    { workers: 1 }
  );

  return {
    stream: Buffer.from(file),
    filename: generateFileName(fileId),
  };
}

function extractQuality(caption) {
  const match = caption.match(/(\d+p|HD|HDRip|WEB-DL)/i);
  return match ? match[0] : 'HD';
}

function generateFileName(fileId) {
  return `movie_${fileId.slice(0, 8)}.mp4`;
}
