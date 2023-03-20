import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';

function validateFileName(name: string): boolean {
  if (!/^[a-zA-Z0-9_-]{5,}$/.test(name)) return false;
  return true;
}

async function createFile(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method != 'POST')
    return res.status(405).json({ error: 'This route only supports POST requests!' });
  if (!body || typeof body.fileName !== 'string' || !validateFileName(body.fileName))
    return res.status(400).json({ error: 'Need a valid name to create a file!' });
  // @ts-ignore
  const { user } = await getSession(req, res);
  await conn.$connect();
  const userData = await conn.user.findUnique({
    where : {
      userName: user.nickname,
    },
    include: {
      contributions: {
        select: {
          fileName: true,
        },
      },
      projects: {
        select: {
          projectId: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!userData)
    return res.status(500).json({ error: 'Failed to fetch user data! Please try to create projects later.' })
  if (userData.contributions.find(({ fileName }) => fileName == body.fileName))
    return res.status(400).json({ error: 'User already has a file with the same name!' });
  await conn.$connect();
  const file = await conn.file.create({
    data: {
      fileName: body.fileName,
      creator: {
        connect: {
          userId: userData.userId,
        },
      },
      contributors: {
        connect: {
          userId: userData.userId,
        },
      },
      edits: [{ userId: userData.userId, on: Date.now().toString() }],
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ fileId: `${file.fileId}` });
}

export default withApiAuthRequired(createFile);