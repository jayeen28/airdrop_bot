export interface MessagePayload {
    tg_id: number;
    type: 'text' | 'photo' | 'video' | 'voice';
    message: string;
    caption?: string;
    fileId?: string
}

export type Queues = 'message';