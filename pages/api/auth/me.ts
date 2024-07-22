import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const SECRET_KEY = '21ef12c40211753af9d293006c6def8f1c97646d79630c2c57c98dbea3cf9669';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).end(); // Corrected line
        }

        res.status(200).json(user);
      });
    } else {
      res.status(401).json({ message: 'Token not provided' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
