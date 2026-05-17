import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.JWT_SECRET || 'development-only-secret';
const ALGORITHM = 'aes-256-cbc';

// Derive a 32-byte key from the JWT_SECRET
const getKey = () => {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
};

const encrypt = (text: string): string => {
  const key = getKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (encryptedText: string): string => {
  const key = getKey();
  const parts = encryptedText.split(':');
  if (parts.length !== 2) return encryptedText;
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export interface ISetting {
  key: string;
  value: string;
  category: string;
  description: string;
  isEncrypted: boolean;
  lastUpdated: Date;
  updatedBy?: mongoose.Types.ObjectId;
}

export interface ISettingDocument extends ISetting, Document {
  getDecryptedValue(): string;
}

const settingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: 'general',
    },
    description: {
      type: String,
      default: '',
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to encrypt value if isEncrypted is true
settingSchema.pre('save', function (next) {
  if (this.isModified('value') && this.isEncrypted) {
    this.value = encrypt(this.value);
  }
  this.lastUpdated = new Date();
  next();
});

// Instance method to get decrypted value
settingSchema.methods.getDecryptedValue = function (): string {
  if (this.isEncrypted) {
    return decrypt(this.value);
  }
  return this.value;
};

// Static method to get a setting by key
settingSchema.statics.getValue = async function (
  key: string
): Promise<string | null> {
  const setting = await this.findOne({ key });
  if (!setting) return null;
  return setting.getDecryptedValue();
};

// Static method to set a setting
settingSchema.statics.setValue = async function (
  key: string,
  value: string,
  isEncrypted: boolean = false,
  userId?: string
): Promise<ISettingDocument> {
  const update: any = {
    value,
    isEncrypted,
    lastUpdated: new Date(),
  };
  if (userId) {
    update.updatedBy = userId;
  }

  const setting = await this.findOneAndUpdate(
    { key },
    update,
    { upsert: true, new: true }
  );
  return setting;
};

// Static method to get multiple settings
settingSchema.statics.getMultiple = async function (
  keys: string[]
): Promise<Record<string, string>> {
  const settings = await this.find({ key: { $in: keys } });
  const result: Record<string, string> = {};
  settings.forEach((setting: ISettingDocument) => {
    result[setting.key] = setting.getDecryptedValue();
  });
  return result;
};

export interface ISettingModel extends mongoose.Model<ISettingDocument> {
  getValue(key: string): Promise<string | null>;
  setValue(
    key: string,
    value: string,
    isEncrypted?: boolean,
    userId?: string
  ): Promise<ISettingDocument>;
  getMultiple(keys: string[]): Promise<Record<string, string>>;
}

const Setting = mongoose.model<ISettingDocument, ISettingModel>(
  'Setting',
  settingSchema
);

export { encrypt, decrypt };
export default Setting;
