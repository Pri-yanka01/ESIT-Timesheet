import mongoose from 'mongoose';

const timesheetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// If the model is already defined, use it, otherwise create a new one
const Timesheet = mongoose.models.Timesheet || mongoose.model('Timesheet', timesheetSchema);

export default Timesheet; 