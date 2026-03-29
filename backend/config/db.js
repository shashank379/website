const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check both common MongoDB URI env variables
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // Log which env var was used
    if (process.env.MONGODB_URI) {
      console.log('✓ Using MONGODB_URI from environment');
    } else if (process.env.MONGO_URI) {
      console.log('✓ Using MONGO_URI from environment');
    } else {
      console.warn('⚠️ Neither MONGODB_URI nor MONGO_URI found');
    }

    if (!mongoUri) {
      throw new Error('MongoDB URI missing. Set MONGODB_URI or MONGO_URI in environment variables.');
    }

    // Mask the URI for logging (don't expose password)
    const maskedUri = mongoUri.replace(/:[^:@]*@/, ':****@');
    console.log(`📡 Connecting to MongoDB: ${maskedUri}`);

    const conn = await mongoose.connect(mongoUri);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('💡 Fix: Ensure MONGODB_URI or MONGO_URI is set in Render environment variables');
    process.exit(1);
  }
};

module.exports = connectDB;
