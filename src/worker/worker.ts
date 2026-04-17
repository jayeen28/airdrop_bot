import amqp from 'amqplib';
import { Queues } from '../lib/types';
import messageReceiver from './receives/message';

let conn: amqp.ChannelModel;
let ch: amqp.Channel;
async function connectRabbit() {
    if (ch) return { conn, ch };
    conn = await amqp.connect({
        hostname: process.env.HOST,
        port: Number(process.env.RABBITMQ_PORT),
        username: process.env.RABBITMQ_USER,
        password: process.env.RABBITMQ_PASS,
    });

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
    console.log('🚀 Worker starting up...');

    try {
        console.log('📡 Connecting to RabbitMQ...');
        await consume('message', messageReceiver);
        console.log('✅ Worker is now listening for messages');
    } catch (error) {
        console.error('❌ Failed to start worker:', error);
        throw error;
    }
}