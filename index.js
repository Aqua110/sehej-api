const cors = require('cors');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const db = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.HOST,
    user: process.env.USER,  // replace with your MySQL username
    password: process.env.PASSWORD,  // replace with your MySQL password
    database: process.env.DATABASE
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});
app.use('/uploads', express.static('uploads'));









// POST API to add a new album image
const upload = multer({ dest: 'uploads/' });

app.post('/albums', upload.single('img'), (req, res) => {
    const { catogary } = req.body;
    const img = req.file;

    if ( !img || !catogary) {
        return res.status(400).json({ error: 'Please provide all three of them img and catogary' });
    }

    // Store the file path or filename, not the entire file object
    const imgPath = img.path; 

    const query = 'INSERT INTO dubai ( img, catogary) VALUES ( ?, ?)';
    db.query(query, [ imgPath,catogary], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Image added successfully', catogary});
    });
});

// GET API to retrieve all album images
app.get('/albums', (req, res) => {
    const query = 'SELECT id, img, catogary FROM dubai';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedResults = results.map(result => ({
            ...result,
            img: `https://node-app.sehejkaur.com/${result.img.replace(/\\/g, '/')}`
        }));

        res.json(formattedResults);
    });
});

// delete api to delete the Images
app.delete('/delimg/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM dubai WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});













// POST API to add a new project

app.post('/addwork', upload.fields([
    { name: 'mainimg', maxCount: 1 },   // Handle image upload
    { name: 'img1', maxCount: 1 },  // Handle video upload
    { name: 'img2', maxCount: 1 },  // Handle video upload
    { name: 'img3', maxCount: 1 },  // Handle video upload
    { name: 'img4', maxCount: 1 },  // Handle video upload
    { name: 'img5', maxCount: 1 }  // Handle video upload
  ]), (req, res) => {
    const { title,type,desc1,desc2 } = req.body;
    const mainimg = req.files['mainimg'][0];
    const img1 = req.files['img1'] ? req.files['img1'][0] : null;
    const img2 = req.files['img2'] ? req.files['img2'][0] : null;
    const img3 = req.files['img3'] ? req.files['img3'][0] : null;
    const img4 = req.files['img4'] ? req.files['img4'][0] : null;
    const img5 = req.files['img5'] ? req.files['img5'][0] : null;

    if (!title || !type || !mainimg || !desc1 || !desc2) {   
        return res.status(400).json({ error: 'Please provide all requierd field Title, Type, Main image, Short Description, Main description' });
    }

    // Store the file path or filename, not the entire file object
    const mainimgPath = mainimg.path;
    const img1Path = img1 ? img1.path : null;
    const img2Path = img2 ? img2.path : null;
    const img3Path = img3 ? img3.path : null;
    const img4Path = img4 ? img4.path : null;
    const img5Path = img5 ? img5.path : null;

    const query = 'INSERT INTO projects (title, type, mainimg, desc1, desc2, img1, img2, img3, img4, img5) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [ title, type, mainimgPath, desc1, desc2, img1Path, img2Path, img3Path, img4Path, img5Path], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'project added successfully', title});
    });
});


// GET API to retrieve all projects
app.get('/getworks', (req, res) => {
    const query = 'SELECT id, title, type, mainimg, desc1, desc2, img1, img2, img3, img4, img5 FROM projects';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedResults = results.map(result => ({
            ...result,
            mainimg: result.mainimg? `https://node-app.sehejkaur.com/${result.mainimg.replace(/\\/g, '/')}`: null,
            img1: result.img1 ?  `https://node-app.sehejkaur.com/${result.img1.replace(/\\/g, '/')}` : null,
            img2: result.img2 ?  `https://node-app.sehejkaur.com/${result.img2.replace(/\\/g, '/')}` : null,
            img2: result.img3 ?  `https://node-app.sehejkaur.com/${result.img3.replace(/\\/g, '/')}` : null,
            img2: result.img4 ?  `https://node-app.sehejkaur.com/${result.img4.replace(/\\/g, '/')}` : null,
            img2: result.img5 ?  `https://node-app.sehejkaur.com/${result.img5.replace(/\\/g, '/')}` : null
        }));

        res.json(formattedResults);
    });
});


// delete api to delete the projects
app.delete('/delproject/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM projects WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});

// PUT API to update a work
app.put('/updatework/:id', upload.fields([
    { name: 'mainimg', maxCount: 1 },
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
    { name: 'img5', maxCount: 1 }
]), (req, res) => {
    const id = req.params.id;
    const { title, type, desc1, desc2, mainimg, img1, img2, img3, img4, img5 } = req.body;
    
    const mainimgFile = req.files['mainimg'] ? req.files['mainimg'][0] : null;
    const img1File = req.files['img1'] ? req.files['img1'][0] : null;
    const img2File = req.files['img2'] ? req.files['img2'][0] : null;
    const img3File = req.files['img3'] ? req.files['img3'][0] : null;
    const img4File = req.files['img4'] ? req.files['img4'][0] : null;
    const img5File = req.files['img5'] ? req.files['img5'][0] : null;

    // Use file paths if files are uploaded; otherwise use provided paths
    const mainimgPath = mainimgFile ? mainimgFile.path : mainimg;
    const img1Path = img1File ? img1File.path : img1;
    const img2Path = img2File ? img2File.path : img2;
    const img3Path = img2File ? img3File.path : img3;
    const img4Path = img2File ? img4File.path : img4;
    const img5Path = img2File ? img5File.path : img5;

    if (!title || !type || !desc1 || !desc2 || !mainimgPath) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Update the record in the database
    const query = 'UPDATE projects SET title = ?, type = ?, desc1 = ?, desc2 = ?, mainimg = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, img5 = ? WHERE id = ?';
    db.query(query, [title, type, desc1, desc2, mainimgPath, img1Path, img2Path, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No record found with the given ID' });
        }
        res.status(200).json({ message: 'Work updated successfully', id, title, mainimgPath, img1Path, img2Path, img3Path, img4Path, img5Path});
    });
});

















// Post api for uploading data
// Configure multer for handling both image and video uploads
// Backend (Node.js + Multer) Code
app.post('/addalbum', upload.fields([
    { name: 'mainimg', maxCount: 1 },   // Handle image upload
    { name: 'mainvideo', maxCount: 1 }  // Handle video upload
  ]), (req, res) => {
    const { title, path } = req.body;
    const mainimg = req.files['mainimg'] ? req.files['mainimg'][0] : null;
    const mainvideo = req.files['mainvideo'] ? req.files['mainvideo'][0] : null;
  
    // Check if either image or video is provided
    if ( !title || (!mainimg && !mainvideo)) {
      return res.status(400).json({ error: 'Please provide title, and either an image or video.' });
    }
  
    // Save the file paths accordingly
    const mainimgPath = mainimg ? mainimg.path : null;
    const mainvideoPath = mainvideo ? mainvideo.path : null;
  
    // Insert into the database (depending on whether an image or video was provided)
    const query = 'INSERT INTO albums ( title, mainimg, mainvideo, path) VALUES ( ?, ?, ?, ?)';
    db.query(query, [ title, mainimgPath, mainvideoPath, path], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Album added successfully', title });
    });
  });
  



// GET API to retrieve albumdata
app.get('/getalbums', (req, res) => {
    const query = 'SELECT id, title, mainimg, mainvideo, path FROM albums';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const formattedResults = results.map(result => ({
            ...result,
            mainimg: result.mainimg? `https://node-app.sehejkaur.com/${result.mainimg.replace(/\\/g, '/')}`: null,
            mainvideo: result.mainvideo ?  `https://node-app.sehejkaur.com/${result.mainvideo.replace(/\\/g, '/')}` : null
        }));

        res.json(formattedResults);
    });
});

// delete api to delete the album
app.delete('/delalbum/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM albums WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});


// PUT API to update an Album
app.put('/updatealbum/:id',upload.fields([
    { name: 'mainimg', maxCount: 1 },   // Handle image upload
    { name: 'mainvideo', maxCount: 1 }  // Handle video upload
  ]), (req, res) => {
    const id = req.params.id;
    const { title,path } = req.body;
    const mainimg = req.files['mainimg'] ? req.files['mainimg'][0] : null;
    const mainvideo = req.files['mainvideo'] ? req.files['mainvideo'][0] : null;

    if ( (!mainimg && !mainvideo) || !title || !path ) {
        return res.status(400).json({ error: 'Please provide All requried feild' });
    }

    // Store the file path or filename
    const mainimgPath = mainimg ? mainimg.path : null;
    const mainvideoPath = mainvideo ? mainvideo.path : null;
    // Update the record in the database
    const query = 'UPDATE albums SET mainimg = ?, title = ?, path  = ?,mainvideo = ? WHERE id = ?';
    db.query(query, [mainimgPath, title, path, mainvideoPath, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No record found with the given ID' });
        }
        res.status(200).json({ message: 'Album updated successfully', id, title});
    });
});




// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
