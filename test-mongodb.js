const mongoose = require('mongoose');
const fs = require('fs');

async function testConnection() {
  // Read the .env.local file directly
  let envContent;
  try {
    envContent = fs.readFileSync('.env.local', 'utf8');
    console.log('ENV file contents:', envContent);
  } catch (err) {
    console.error('Error reading .env.local file:', err);
    return;
  }
  
  // Extract the MongoDB URI
  const match = envContent.match(/MONGODB_URI=(.+)/);
  const mongoUri = match ? match[1].trim() : null;
  
  if (!mongoUri) {
    console.error('Could not find MONGODB_URI in .env.local file');
    return;
  }
  
  console.log('MongoDB URI found:', mongoUri);
  
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