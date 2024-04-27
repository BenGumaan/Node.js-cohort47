import fs from 'fs';
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { v4 as generateUniqueID } from 'uuid';
import usersDatabase from './db.json' assert { type: "json" };
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 12;

export const register = async (req, res) => {

  const { username, password } = req.body; 

  if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' }).end();
    return;
  }

  const IsUserExists = usersDatabase.find(user => user.username === username);
  
  if (IsUserExists) {
    res.status(400).json({ message: 'Username already exists' }).end();
    return;
  }

  try {
    const hashedPassword = await hash(password, SALT_ROUNDS);
    const newUser = {
      id: generateUniqueID(), 
      username: username,
      password: hashedPassword,
    };

    usersDatabase.push(newUser);

    fs.writeFileSync('./db.json', JSON.stringify(usersDatabase, null, 5));

    res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username,
    }).end();
  } catch (error) {
    res.status(500).json({ message: 'An error occured while registering the user' }).end();
  }
};

export const login = async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
    res.status(400).json({ message: 'Please provide username and password' }).end();
    return;
  }

  try {
    const user = usersDatabase.find(user => user.username === username);
    const isPasswordCorrect = await compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      res.status(401).json({ message: 'Invalid username or password' }).end();
      return;
    }

    const token = jwt.sign(user.id, process.env.JWT_SECRET);
    // Set the token in the Authorization header using the Bearer schema
    res.set('Authorization', `Bearer ${token}`);
    res.status(200).json({ message: 'User logged in successfully', token }).end();
  } catch (error) {
    res.status(500).json({ message: `Internal server error + ${error}` }).end();
  }
};

export const getProfile = async (req, res) => {
  const token = getSessionId(req);

  if (!token) {
    res.status(401).json({ message: 'User is not logged in' }).end();
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

      if (err) {
        res.status(401).json({ message: 'Invalid token' }).end();
        return;
      }

      const user = usersDatabase.find(user => user.id === decoded);

      if (!user) {
        res.status(401).json({ message: 'User not found' }).end();
        return;
      }
      res.status(200).json({ message: `Hello, you are logged in as ${user.username}!` }).end();
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' }).end();
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'You are logged out successfully!' }).end();
}

// helper functions
const getSessionId = (req) => {
  const authorizationHeader = req.headers['authorization'];
  if(!authorizationHeader) {
    return null;
  }
  const sessionId = authorizationHeader.replace('Bearer ', '');
  return sessionId.trim();
};


