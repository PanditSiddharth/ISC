const uri = process.env.URI + "ignou?retryWrites=true&w=majority"
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Connect to MongoDB using a connection pool
mongoose.connect(uri);

const sellerSchema = new mongoose.Schema({
  sellerId: {
    type: Number,
    required: true,
    unique: true
  },
  shop: {
    type: String,
    default: "none"
  },
  sellerName: { // command from which will user can run code
    type: String,
    required: true,
  },
  sellerPhone: { 
    type: String,
    required: true
  },
  address: { 
    type: String,
    default: "none"
  },
  description: {
    type: String,
    default: "none"
  }, 
  level: {
    type: Number
  },
  soldItems: {
    type: Number
  },
  soldItemsPrice: {
    type: Number
  },
  pic: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: String,
    default: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  }
});

const seld = mongoose.model('seller', sellerSchema);

const studentSchema = new mongoose.Schema({
  stuId: {
    type: Number,
    required: true,
    unique: true
  },
  degree: {
    type: String,
    default: ""
  },
  stuName: { 
    type: String,
    required: true,
  },
  stuPhone: { 
    type: String
  },
  address: { // code which will be excecuted
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  }, // command description
  level: {
    type: Number
  },
  soldItems: {
    type: Number
  },
  soldItemsPrice: {
    type: Number
  },
  pic: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: String,
    default: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  }
});

const stud = mongoose.model('student', studentSchema);

const docSchema = new mongoose.Schema({
  docId: {
    type: Number,
    required: true,
    unique: true
  },
  docFromId: {
    type: String,
    required: true
  },
  docPrice: { 
    type: String,
    required: true,
  },
  docDescription: { 
    type: String,
    default: "none"
  },
  docName: { // code which will be excecuted
    type: String,
    required: true
  },
  description: {
    type: String,
    default: "none"
  }, // command description
  level: {
    type: Number
  },
  docSoldCount: {
    type: Number,
    required: true
  },
  sample: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: String,
    default: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  }
});

const docd = mongoose.model('document', docSchema);


const tempSSchema = new mongoose.Schema({
  sellerId: {
    type: Number,
    required: true,
    unique: true
  },
  shop: {
    type: String,
    default: "none"
  },
  sellerName: { // command from which will user can run code
    type: String,
    required: true,
  },
  sellerPhone: { 
    type: String,
    required: true
  },
  address: { 
    type: String,
    default: "none"
  },
  description: {
    type: String,
    default: "none"
  }, 
  level: {
    type: Number
  },
  soldItems: {
    type: Number
  },
  soldItemsPrice: {
    type: Number
  },
  pic: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "none" // none, pending, approved, rejected
  },
  timestamp: {
    type: String,
    default: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  }
});

const tempsd = mongoose.model('temps', tempSSchema);

module.exports = { seld, stud, docd, tempsd };