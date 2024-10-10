import { User } from '../model/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userSignup = async (req, res) => {
  try {
    const saltRounds = 10;

    const { name, email, password, gender } = req.body;

    if (!name || !email || !password || !gender) {
      return res.status(400).json({ mesg: 'all fields are required' });
    }
    const hashedpassword = await bcrypt.hash(password, saltRounds);

    const male =
      'https://img.freepik.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666683.jpg?t=st=1723609737~exp=1723613337~hmac=325d90eef8c2e6111f02b8587124d0933ae0acd75c0715d95888c571f60d94ed&w=360';

    const female =
      'https://img.freepik.com/free-photo/beautiful-anime-woman-cartoon-scene_23-2151035231.jpg?t=st=1723609658~exp=1723613258~hmac=365b792ec493a8906ec23671c76a3fb01551ffadeaa07e406c35db03e7dcf2ef&w=826';

    const profile = gender === 'male' ? male : female;

    const user = await User.create({
      name,
      password: hashedpassword,
      email,
      gender,
      profile,
    });

    res.status(201).json({
      mesg: 'User Created Successfully ...',
    });
  } catch (e) {
    console.log(e.errmsg);
    res.status(500).json({ mesg: e.errmsg });
  }
};

//usersignin
export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email: email });
    if (!checkUser) {
      return res.status(404).json({ mesg: 'User NotFound check again' });
    }
    const isMatch = await checkUser.validationFunction(password);
    if (!isMatch) {
      return res.status(400).json({ mesg: 'password mismatch tryagian' });
    }

    //jwt sign(payload , screat-key , {expiresIn:"value"} )

    const token = jwt.sign({ user_id: checkUser._id }, process.env.jwt, {
      expiresIn: '15d',
    });

    req.user_id = checkUser._id;

    res.status(200).json({
      mesg: 'token created ... login successfull',
      user_id: checkUser._id,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ mesg: e.message });
  }
};

//getting all the users details except for the user that logged in
//one we can get userid from frontend and make fileter or
//second we can directly get the user here in req.userID that passed in as paylOad
export const getAllUsers = async (req, res) => {
  try {
    const requestingUser = req.user_id;
    const UserDetails = await User.find({
      _id: { $ne: requestingUser },
    })
      .select({ password: 0 })
      .sort();
    res.status(200).json({ data: UserDetails });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      mesg: 'internal error check the backend logs cannot display here !',
    });
  }
};
