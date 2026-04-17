export interface MessagePayload {
    tg_id: number;
    type: 'text' | 'photo' | 'video' | 'voice';
    message: string;
    caption?: string;
    fileId?: number
}

export type Queues = 'message';