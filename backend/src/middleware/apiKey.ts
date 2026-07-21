import { Request, Response, NextFunction } from 'express';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ status: 'error', message: 'API Key is required in header X-API-Key' });
  }

  // Demo key verification (in prod, query from developer collection)
  if (apiKey === 'swadesh_dev_key_12345') {
    next();
  } else {
    return res.status(403).json({ status: 'error', message: 'Forbidden: Invalid API Key' });
  }
};
