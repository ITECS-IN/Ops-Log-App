import { Injectable, NestMiddleware } from '@nestjs/common';
import admin from './firebase-init';

@Injectable()
export class FirebaseAuthMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      res.status(401).json({ message: 'Missing Authorization header' });
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
