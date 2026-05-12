import mongoose from 'mongoose';

const genericActivitySchema = new mongoose.Schema(
  {
    sportSlug: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    duration: { type: Number }, // minutes
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.GenericActivity ||
  mongoose.model('GenericActivity', genericActivitySchema);
