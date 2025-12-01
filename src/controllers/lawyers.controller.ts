import { Request, Response } from 'express';
import * as lawyerService from '../services/lawyer.service.js';
import config from '../config/index.js';

export async function search(req: Request, res: Response) {
  const q = req.query.q as string | undefined;
  const specialization = req.query.specialization as string | undefined;
  const city = req.query.city as string | undefined;
  const minExperience = req.query.minExperience ? Number(req.query.minExperience) : undefined;
  const maxFee = req.query.maxFee ? Number(req.query.maxFee) : undefined;
  const languages = req.query.languages ? String(req.query.languages).split(',').map(s => s.trim()).filter(Boolean) : undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const sortBy = req.query.sortBy as any;
  const order = (req.query.order as any) || 'desc';

  const result = await lawyerService.search({ q, specialization, city, minExperience, maxFee, languages, page, limit, sortBy, order });
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = req.params.id;
  const lawyer = await lawyerService.getById(id);
  if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
  res.json({ lawyer });
}

export async function update(req: Request, res: Response) {
  const id = req.params.id;
  const payload = req.body;
  try {
    const updated = await lawyerService.updateById(id, payload);
    res.json({ lawyer: updated });
  } catch (err: any) {
    res.status(400).json({ error: String(err.message ?? err) });
  }
}

export async function apply(req: Request, res: Response) {
  // Preferred flow: frontend uploads files directly to S3/Cloudinary and sends metadata to backend.
  // Here we provide an upload URL for S3 when credentials are available.
  const { fileName, fileType } = req.body as { fileName?: string; fileType?: string };

  if (config.aws?.s3?.bucket && config.aws?.s3?.accessKeyId && config.aws?.s3?.secretAccessKey) {
    try {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

      const client = new S3Client({
        region: config.aws.s3.region,
        credentials: {
          accessKeyId: config.aws.s3.accessKeyId!,
          secretAccessKey: config.aws.s3.secretAccessKey!,
        },
      });

      const key = `${Date.now()}-${fileName || 'upload'}`;
      const cmd = new PutObjectCommand({ Bucket: config.aws.s3.bucket, Key: key, ContentType: fileType || 'application/octet-stream' });
      const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
      return res.json({ uploadUrl: url, key, method: 'PUT' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create S3 signed url', details: String(err.message ?? err) });
    }
  }

  // If S3 not configured, instruct frontend to use cloud provider; return guidance payload
  res.status(501).json({
    message: 'Direct client upload preferred. Configure S3 to enable presigned url support.',
    guidance: {
      provider: 's3',
      path: 'lawyer-applications/<timestamp>-filename',
      method: 'PUT',
      headers: { 'Content-Type': fileType || 'application/octet-stream' },
    },
  });
}

export default { search, getById, update, apply };
