// import { Request, Response } from 'express';
// import storageService from '../services/storage.service.js';



// export async function generatePresignedUpload(req: Request, res: Response) {
//   try {
//     const uploaderId = (req as any).user?.id as string;
//     if (!uploaderId) return res.status(401).json({ error: 'Unauthorized' });

//     const { fileName, mimeType, size } = req.body as any;

//     // generate presigned URL for upload
//     const key = `documents/${uploaderId}-${Date.now()}-${fileName}`;
//     const presigned = await storageService.createPresignedUpload(key, mimeType);
//     if (!presigned) return res.status(501).json({ error: 'Storage not configured' });
//     res.status(201).json({ upload: presigned });
//   } catch (err: any) {
//     res.status(400).json({ error: String(err.message ?? err) });
//   }
// }

// export default {generatePresignedUpload}