import mongoose, { InferSchemaType, model, models, PaginateModel, Schema } from "mongoose";
import paginate from 'mongoose-paginate-v2';
import pointSchema from "./point.model";

export const messageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    point: {
        type: pointSchema,
        required: true
    },
    type: { type: String, enum: ['text', 'photo', 'video', 'voice'] },
    fileId: {
        type: String,
        required: function () {
            return this.type === 'photo' || this.type === 'video' || this.type === 'voice';
        }
    },
    message: { type: String, default: 'New message' },
    caption: { type: String },
    radius: { type: Number, default: 500 }
});


messageSchema.plugin(paginate);

export type MessageDocument = InferSchemaType<typeof messageSchema>;
export const Message = (models.Message as PaginateModel<MessageDocument>) || model<MessageDocument, PaginateModel<MessageDocument>>('Message', messageSchema)
