const express = require('express');
const bcrypt = require('bcryptjs'); // Updated import for bcryptjs
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const tinify = require('tinify');
const compression = require('compression')
const fs = require('fs');
require('dotenv').config();




const productsRepo = require('./repositories/products')
const products = require('./repositories/products');
const internal = require('stream');
const LandingRepo = require('./repositories/landingPage');
const UsersRepo = require('./repositories/users');

const { log } = require('console');
const landingPage = require('./repositories/landingPage');




const app = express();
const port = process.env.PORT || 5000;


app.use(compression());

app.use(bodyParser.json());


const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });












// JWT Secret (Use environment variables in production)
const jwtSecret = process.env.JWT_SECRET; 

// Registration Route
//"https://call-a-bowl-fullstack-project-a6kp-client.vercel.app/",

app.use(cors(
  {
    origin:(origin, callback) => callback(null, true),
    credentials: true
  }
));
/* app.use(cors(
  {
    origin:"https://call-a-bowl-fullstack-project-a6kp-client.vercel.app"
  }
)); */


app.get('/', (req, res) => res.json("Server working......"))

app.post('/api/register', async (req, res) => {
  const { username, password, code } = req.body;

  try {
    // Check if the code is correct

    if (code !== 'CREATENEWBOWL') {
      console.log('invalid code');
      return res.status(401).json({ error: 'Invalid code' });
    }

    let all = await UsersRepo.getAll();

    // Ensure that all.users is initialized as an array
  // Ensure that all is an array
if (!Array.isArray(all)) {
  all = [];
}

// Check if the username already exists
const isDuplicate =Object.values(all).some((user) => user.username === username);

if (isDuplicate) {
  return res.status(400).json({ error: 'Username already exists' });
}

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      username,
      password: hashedPassword,
    };


    // Save the updated products
    await UsersRepo.create(newUser);
    const token = jwt.sign({ username }, jwtSecret); // Use the secret
    res.status(201).json({ message: 'User registered successfully' ,token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const usersData = await UsersRepo.getAll(); // Assuming usersData is an object with user IDs as keys
    console.log(usersData);
    
    // Convert the object to an array of user objects
    const users = Object.values(usersData);
    
    // Find the user by username
    const user = Object.values(users).find(user => user.username === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create and send a JSON Web Token (JWT)
    const token = jwt.sign({ username }, jwtSecret); // Use the secret
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/login', async (req, res) => {
  try {

    res.send('hi');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied, token not provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Protected route (Example)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});



app.get('/api/products', async (req, res) => {
  const data = {    
      "Landing_Page": await LandingRepo.getAll(),
      "MENU": await productsRepo.getAll(),
      "USERS": await UsersRepo.getAll(),
    }

    const dataArray = Object.entries(data).map(([key, value]) => ({ [key]: value }));
  res.status(201).json({ message: 'Item sent', newItem:  data});
    /* const dataArray = Object.entries(data).map(([key, value]) => ({ [key]: value }));
  res.status(201).json({ message: 'Item added successfully', newItem:  dataArray}); */
});


tinify.key = process.env.TINIFY_API_KEY;

app.post('/api/product/new', upload.single('IMAGE'), async (req, res) => {
  try {
    let imageBuffer = '';

    // Check if an image was uploaded
    if (req.file) {
      const firstCompressedBuffer = await tinify.fromBuffer(req.file.buffer).toBuffer();
  
      // Second compression
      const doublyCompressedBuffer = await tinify.fromBuffer(firstCompressedBuffer).toBuffer();
      
      imageBuffer = doublyCompressedBuffer;
    }

    // Access the other form data
    const newItemDetails = {
      MENU: req.body.MENU,
      PRICE: req.body.PRICE,
      CATEGORY: req.body.CATEGORY,
      IMAGE: imageBuffer.toString('base64'),
    };
console.log(newItemDetails);
    // Load the existing products
    const products = await productsRepo.getAll();

    // Check if MENU and CATEGORY combination already exists in products.MENU
    const isDuplicate = Object.values(products).some((item) => (
      item.MENU === newItemDetails.MENU && item.CATEGORY === newItemDetails.CATEGORY
    ));

    if (isDuplicate) {
      return res.status(400).json({ error: 'Item with the same MENU and CATEGORY already exists' });
    }

   

    // Save the updated products
    await productsRepo.create(newItemDetails);

    res.status(201).json({ message: 'Item added successfully', newItem: newItemDetails });
  } catch (error) {
    console.error('Error in /api/product/new:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/product/delete', async (req, res) => {
  try {
    const { itemName, CATEGORY } = req.body;
    const reposit = await productsRepo.getAll();

    // Log the received parameters
    console.log('Deleting item:', itemName, 'in category:', CATEGORY);

    // Check if the item exists before attempting deletion
    const existingItem =  Object.values(reposit).find(item => item.MENU === itemName && item.CATEGORY === CATEGORY);

    if (!existingItem) {
      return res.status(404).json({ error: `Item ${itemName} not found in category ${CATEGORY}` });
    }

    // Log before deletion
    console.log('Deleting item from repository:', existingItem);

    // Perform the deletion
    await productsRepo.delete(itemName);
    
    console.log('Deleted successfully');
    const response = await productsRepo.getAll();
     res.status(200).json({ message: `Item ${itemName} deleted successfully`, newItem:  response});
  } catch (error) {
    console.error('Error in /api/product/delete:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/product/edit', upload.single('IMAGE'), async (req, res) => {
  try {
    let imageBuffer = '';
    let newItemDetails = {};
    let image = ''
   

    if (req.file) {
      // Use Tinify to compress the uploaded image
      const firstCompressedBuffer = await tinify.fromBuffer(req.file.buffer).toBuffer();

      // Second compression
      const doublyCompressedBuffer = await tinify.fromBuffer(firstCompressedBuffer).toBuffer();

      imageBuffer = doublyCompressedBuffer;
      
    }
    
    const { prevMENU, prevCATEGORY, MENU, CATEGORY, PRICE, hiddenField,BOWLS } = req.body;

    // If no image was uploaded, set IMAGE to an empty string
     newItemDetails = {
      MENU,
      PRICE,
      BOWLS,
      CATEGORY,
      IMAGE:  req.file ? imageBuffer.toString('base64') : hiddenField, // Convert to base64 if an image is uploaded
    };

    productsRepo.update(prevMENU, newItemDetails);

    const newproducts = await productsRepo.getAll();

    res.status(201).json({ message: `Item ${MENU} edited successfully`, newItem: req.body.CATEGORY });
  } catch (error) {
    console.error(error);
    console.log('internal');
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/special/new', upload.single('IMAGE'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('hey');

    let imageBuffer = '';

    // Use Tinify to compress the uploaded image
    const compressedBuffer = await tinify.fromBuffer(req.file.buffer).toBuffer();
    imageBuffer = compressedBuffer;

    // Access the other form data
    const newItemDetails = {
      MENU: req.body.MENU,
      PRICE: req.body.PRICE,
      CATEGORY: req.body.CATEGORY,
      IMAGE: imageBuffer.toString('base64'),
    };

    // Load the existing products
    const landing_Page = await LandingRepo.getAll();
    // Check if MENU and CATEGORY combination already exists in products.Landing_Page.SPECIAL_ORDER
    const isDuplicate = Object.values(landing_Page).some((item) => (
      item.MENU === newItemDetails.MENU && item.CATEGORY === newItemDetails.CATEGORY
    ));

    if (isDuplicate) {
      return res.status(400).json({ error: 'Item with the same MENU and CATEGORY already exists' });
    }

    // If not a duplicate, push the new item to Landing_Page.SPECIAL_ORDER
    

    // Save the updated products
    await LandingRepo.create(newItemDetails);

    res.status(201).json({ message: 'Item added successfully', newItem: newItemDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/special/delete', async (req, res) => {
  try {
    const { itemName,CATEGORY } = req.body;
    const repo = await LandingRepo.getAll()

    LandingRepo.delete(itemName)
    
    res.status(201).json({ message: `Item ${itemName} deleted successfully hii`, newItem: req.body.CATEGORY });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/special/edit', upload.single('IMAGE'), async (req, res) => {
  try {
    let imageBuffer = '';
    
    if (req.file) {
      // Use Tinify to compress the uploaded image
      const compressedBuffer = await tinify.fromBuffer(req.file.buffer).toBuffer();
      imageBuffer = compressedBuffer;
    }
    
    
    const { prevMENU, prevCATEGORY, MENU, CATEGORY, PRICE } = req.body;
    const newItemDetails = {
      MENU,
      PRICE,
      CATEGORY,
      IMAGE: req.file ? imageBuffer.toString('base64'): '', 
    };

    LandingRepo.update(prevMENU, newItemDetails);

    const newproducts = await productsRepo.getAll();

    res.status(201).json({ message: `Item ${MENU} edited successfully`, newItem: req.body.CATEGORY });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/logout', (req, res) => {
  // You can add logic here to invalidate the token or perform any necessary cleanup
  res.json({ message: 'Logged out successfully' });
});









// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
