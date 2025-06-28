import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@toki/db';
import { DatabaseConfig } from '@toki/db';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: any;
}

export class AuthMiddleware {
  private userRepository: UserRepository;

  constructor(dbConfig: DatabaseConfig) {
    this.userRepository = new UserRepository(dbConfig);
  }

  async authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: '認証トークンが必要です',
        });
      }

      const token = authHeader.substring(7); // "Bearer " を除去

      // Firebaseトークンを検証
      const userId = await this.userRepository.verifyToken(token);
      
      if (!userId) {
        return res.status(401).json({
          error: '無効なトークンです',
        });
      }

      // ユーザー情報を取得
      const user = await this.userRepository.getUser(userId);
      if (!user) {
        return res.status(401).json({
          error: 'ユーザーが見つかりません',
        });
      }

      // リクエストにユーザー情報を追加
      req.userId = userId;
      req.user = user;

      next();
    } catch (error) {
      console.error('認証エラー:', error);
      return res.status(401).json({
        error: '認証に失敗しました',
      });
    }
  }

  // オプショナル認証（認証がなくても進めるが、あればユーザー情報を設定）
  async optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(); // 認証なしで続行
      }

      const token = authHeader.substring(7);

      // Firebaseトークンを検証
      const userId = await this.userRepository.verifyToken(token);
      
      if (userId) {
        const user = await this.userRepository.getUser(userId);
        if (user) {
          req.userId = userId;
          req.user = user;
        }
      }

      next();
    } catch (error) {
      console.error('オプショナル認証エラー:', error);
      next(); // エラーがあっても続行
    }
  }

  // 管理者権限チェック
  requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({
        error: '認証が必要です',
      });
    }

    // 管理者権限のチェック（実装は後で追加）
    const isAdmin = req.user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({
        error: '管理者権限が必要です',
      });
    }

    next();
  }

  // CORS設定
  corsMiddleware(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }
} 