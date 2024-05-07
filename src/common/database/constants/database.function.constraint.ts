import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
export const DatabaseDefaultUUID = nanoid();

export const DatabaseDefaultObjectId = () => new Types.ObjectId();
