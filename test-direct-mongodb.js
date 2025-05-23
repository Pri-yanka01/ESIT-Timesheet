const mongoose = require('mongoose');

async function testConnection() {
  const mongoUri = 'mongodb+srv://spriyankapatil01:22IkyWyDYrmSiX6w@cluster0.pxtts6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('Testing connection with URI:', mongoUri);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully!');
    
    // Create a simple test schema
    const TestSchema = new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    });
    
    // Create or get model
    const Test = mongoose.models.Test || mongoose.model('Test', TestSchema);
    
    // Create a test document
    const testDoc = await Test.create({ name: 'Connection Test' });
    console.log('Test document created:', testDoc);
    
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 