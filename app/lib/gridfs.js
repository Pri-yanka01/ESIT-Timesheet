import { MongoClient, GridFSBucket } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://spriyankapatil01:22IkyWyDYrmSiX6w@cluster0.pxtts6e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let cachedClient = null;
let cachedBucket = null;

export async function connectToGridFS() {
  if (cachedClient && cachedBucket) {
    return { client: cachedClient, bucket: cachedBucket };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();
  const bucket = new GridFSBucket(db, {
    bucketName: 'timesheets'
  });

  cachedClient = client;
  cachedBucket = bucket;

  return { client, bucket };
}

export async function uploadFile(buffer, filename, metadata = {}) {
  const { bucket } = await connectToGridFS();
  
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata
    });
    
    uploadStream.on('error', reject);
    uploadStream.on('finish', function(file) {
      resolve(file);
    });
    
    uploadStream.end(buffer);
  });
}

export async function getFile(fileId) {
  const { bucket } = await connectToGridFS();
  
  return new Promise((resolve, reject) => {
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('error', reject);
    downloadStream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
} 