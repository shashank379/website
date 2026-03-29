const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const products = require('./data/products');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log('Products imported successfully');
    console.log('Run: npm run seed:products:destroy to delete seeded products');
    process.exit();
  } catch (error) {
    console.error('Import data error:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();

    console.log('Products deleted successfully');
    process.exit();
  } catch (error) {
    console.error('Destroy data error:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
