import mongoose from 'mongoose';

// Define a schema for file metadata
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  length: {
    type: Number,
  },
  chunkSize: {
    type: Number,
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Object,
    default: {}
  }
});

// Create the model or use existing one
const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File; 