import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    color: { type: String, required: true }, // hex, ex: '#6366f1'
    emoji: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Sport || mongoose.model('Sport', sportSchema);
