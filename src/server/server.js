import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const productsFilePath = path.join(__dirname, '../api/products/products.json');
const productsDir = path.dirname(productsFilePath);

// Ensure the directory and file exist
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

if (!fs.existsSync(productsFilePath)) {
  fs.writeFileSync(productsFilePath, '[]', 'utf8');
}

app.get('/api/products', (req, res) => {
  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      res.status(500).send('Error reading products file');
      return;
    }
    res.send(JSON.parse(data));
  });
});

app.post('/api/products', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).send('No file uploaded');
    return;
  }

  const imagePath = path.join(__dirname, '../assets/images', req.file.originalname);
  const imageDir = path.dirname(imagePath);

  // Ensure the directory exists
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  console.log('Processing image:', req.file.originalname);
  console.log('Image path:', imagePath);

  sharp(req.file.buffer)
    .resize(300, 300)
    .toFile(imagePath, (err) => {
      if (err) {
        console.error('Error processing image:', err);
        res.status(500).send('Error processing image');
        return;
      }

      console.log('Image processed successfully:', imagePath);

      fs.readFile(productsFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading products file:', err);
          res.status(500).send('Error reading products file');
          return;
        }

        let products;
        try {
          products = JSON.parse(data);
        } catch (parseErr) {
          console.error('Error parsing products file:', parseErr);
          res.status(500).send('Error parsing products file');
          return;
        }

        const newProduct = {
          productId: products.length ? Math.max(...products.map(p => p.productId)) + 1 : 1,
          productName: req.body.productName,
          productCode: req.body.productCode,
          price: parseFloat(req.body.price),
          description: req.body.description,
          starRating: 0,
          imageUrl: `assets/images/${req.file.originalname}`
        };

        products.push(newProduct);

        fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
          if (err) {
            console.error('Error writing products file:', err);
            res.status(500).send('Error writing products file');
            return;
          }
          console.log('Product added successfully:', newProduct);
          res.status(201).send(newProduct);
        });
      });
    });
});

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const imagePath = req.file ? path.join(__dirname, '../assets/images', req.file.originalname) : null;
  const imageDir = imagePath ? path.dirname(imagePath) : null;

  if (imagePath && imageDir && !fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      res.status(500).send('Error reading products file');
      return;
    }

    let products;
    try {
      products = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing products file:', parseErr);
      res.status(500).send('Error parsing products file');
      return;
    }

    const productIndex = products.findIndex(p => p.productId === productId);
    if (productIndex === -1) {
      res.status(404).send('Product not found');
      return;
    }

    const updatedProduct = {
      ...products[productIndex],
      productName: req.body.productName,
      productCode: req.body.productCode,
      price: parseFloat(req.body.price),
      description: req.body.description,
      imageUrl: imagePath ? `assets/images/${req.file.originalname}` : products[productIndex].imageUrl
    };

    products[productIndex] = updatedProduct;

    if (imagePath) {
      sharp(req.file.buffer)
        .resize(300, 300)
        .toFile(imagePath, (err) => {
          if (err) {
            console.error('Error processing image:', err);
            res.status(500).send('Error processing image');
            return;
          }

          fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
            if (err) {
              console.error('Error writing products file:', err);
              res.status(500).send('Error writing products file');
              return;
            }
            console.log('Product updated successfully:', updatedProduct);
            res.status(200).send(updatedProduct);
          });
        });
    } else {
      fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
        if (err) {
          console.error('Error writing products file:', err);
          res.status(500).send('Error writing products file');
          return;
        }
        console.log('Product updated successfully:', updatedProduct);
        res.status(200).send(updatedProduct);
      });
    }
  });
});

app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);

  fs.readFile(productsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading products file:', err);
      res.status(500).send('Error reading products file');
      return;
    }

    let products;
    try {
      products = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing products file:', parseErr);
      res.status(500).send('Error parsing products file');
      return;
    }

    const productIndex = products.findIndex(p => p.productId === productId);
    if (productIndex === -1) {
      res.status(404).send('Product not found');
      return;
    }

    const product = products[productIndex];
    const imagePath = path.join(__dirname, '../', product.imageUrl);

    products.splice(productIndex, 1);

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error('Error writing products file:', err);
        res.status(500).send('Error writing products file');
        return;
      }

      // Delete the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          res.status(500).send('Error deleting image file');
          return;
        }
        console.log('Product and image deleted successfully:', productId);
        res.status(200).send();
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});