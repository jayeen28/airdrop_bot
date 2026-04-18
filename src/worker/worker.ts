import amqp from 'amqplib';
import { Queues } from '../lib/types';
import messageReceiver from './receivers/message';

let conn: amqp.ChannelModel;
let ch: amqp.Channel;
async function connectRabbit() {
    if (ch) return { conn, ch };
    conn = await amqp.connect(process.env.RABBITMQ_URL!);

    ch = await conn.createChannel();

    return { ch, conn };

}

export async function publish(queue: Queues, msg: string) {
    const { ch } = await connectRabbit();

    await ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, Buffer.from(msg));
}

export async function consume(queue: Queues, processor: (payload: any) => Promise<void>) {
    const { ch } = await connectRabbit();

    await ch.assertQueue(queue);
    await ch.consume(queue, async (msg) => {
        if (!msg) return;
        try {
            const data = JSON.parse(msg.content.toString());

            await processor(data);

            ch.ack(msg);
        } catch (e) {
            console.error("Processing failed", e);
            ch.nack(msg);
        }
    }, { noAck: false });
}

export default async function worker() {
    try {
        console.log('📡 Connecting to RabbitMQ...');
        await consume('message', messageReceiver);
        console.log('✅ Worker is now listening for messages');
    } catch (error) {
        console.error('❌ Failed to start worker:', error);
        throw error;
    }
}