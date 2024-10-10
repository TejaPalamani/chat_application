import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';

export const validation = async (req, res, next) => {
  try {
    console.log(
      `Validation middleware triggered for ${req.method} ${req.path}`
    );

    const validationToken = req.headers.authorization;
    if (!validationToken) {
      console.log('No validation token provided');
      return res.status(400).json({ mesg: 'notAuthorized' });
    }

    const jwt_token = validationToken.split(' ')[1];
    jwt.verify(jwt_token, process.env.jwt, (err, decodedObject) => {
      if (err) {
        console.log('JWT validation error:', err);
        return res
          .status(400)
          .json({ mesg: 'notAuthorized Validation failed' });
      }

      req.user_id = decodedObject.user_id;
      console.log('User ID set in request:', req.user_id);

      next();
    });
  } catch (e) {
    console.log('Validation middleware error:', e.message);
    res.status(500).json({ mesg: 'validation error' });
  }
};
