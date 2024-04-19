const express = require('express');
const fs = require("fs");
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json())

app.get('/', function (req, res) {
  res.send('Hello World')
})
 

// Read specific post
app.get('/blogs/:title', async (req, res) => {
  
  try {

    const title = req.params.title;

    if (fs.existsSync(title)) {

      const post = fs.readFileSync(title, 'utf8');

      await res.json({title: title, content: post});

      res.end('ok');

    } else {
      res.end('This post does not exist!');
    }

  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('An error occurred while reading the file. Please try again later.');
  }

})


// Adding post
app.post('/blogs', async (req, res) => {

  
  try {            
    let title = req.body.title;
    let content = req.body.content;

    if (title === undefined || content === undefined) {
      return res.end('Please provide both the title and content of the file.');
    }

    await res.json({title, content});
    await fs.writeFileSync(`${title}.txt`, content);
    
    res.end('Data written to file successfully');

  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('An error occurred while writing to the file. Please try again later.');
  }

})

// Updating existing post
app.put('/posts/:title', async (req, res) => {

  try {
    let title = req.params.title;
    let content = req.body.content;

    if (title === undefined || content === undefined) {
      return res.end('Please provide both the title and content of the file.');
    }
    
    const fileName = title;
    
    if (fs.existsSync(fileName)) {
      await res.json({fileName, content});
      await fs.writeFileSync(fileName, content);
      res.end('ok');
    }
    else {
      res.end('This post does not exist!');
    }
    
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('An error occurred while reading the file. Please try again later.');
  }
  
})

// Deleting post
app.delete('/blogs/:title', (req, res) => {

  try {
    const title = req.params.title;

    if (fs.existsSync(title)) {
      fs.unlinkSync(title);
      res.end("Post's been deleted successfully!");
    } else {
      res.end('This post does not exist!');
    }

  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('An error occurred while reading the file. Please try again later.');
  }

})

// Read all posts inside a folder
app.get('/blogs', (req, res) => {
  
  try {
    let filesArray = [];

    fs.readdir(__dirname, (err, files) => {

      if (err) {
        console.error('Error reading directory:', err);
        return;
      }

      files.forEach(file => {
        if (path.extname(file) === '.txt') {
          filesArray.push({title: file});
        }
      });

      res.json({'Files in the directory': filesArray});

    });

  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('An error occurred while reading the file. Please try again later.');
  }

})

 

app.listen(PORT, (error) => {
	if (error) {
		console.log('Something went wrong ', error);
	} else {
		console.log('Server is up and listening on port ', + PORT);
	}
});
