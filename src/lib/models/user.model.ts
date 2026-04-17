import { InferSchemaType, model, models, PaginateModel, Schema } from "mongoose";
import pointSchema from "./point.model";
import paginate from 'mongoose-paginate-v2';

export const UserSchema = new Schema({
    tg_id: {
        type: Number,
        required: true,
        unique: true
    },
    pin: {
        type: pointSchema,
        default: null,
    },
    listening: {
        type: Boolean,
        required: true,
        default: false
    }
});

UserSchema.index({ pin: "2dsphere" });
UserSchema.plugin(paginate);

export type UserDocument = InferSchemaType<typeof UserSchema>;
export const User = (models.User as PaginateModel<UserDocument>) || model<UserDocument, PaginateModel<UserDocument>>('User', UserSchema)
