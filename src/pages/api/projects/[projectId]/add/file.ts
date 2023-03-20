import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';

function validateFileName(name: string): boolean {
  if (!/^[a-zA-Z0-9_-]{5,}$/.test(name)) return false;
  return true;
}

async function addFile(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  if (method != 'POST')
    return res.status(405).json({ error: 'This route only supports POST requests!' });
  if (!query || typeof query.projectId !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid project Id!' });
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
      projects: {
        select: {
          projectId: true,
        },
      },
    },
  });
  const projectData = await conn.project.findUnique({
    where: {
      projectId: query.projectId,
    },
    include: {
      files: {
        select: {
          fileId: true,
          fileName: true,
        },
      },
      collaborators: {
        select: {
          userId: true,
          userName: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!userData || !projectData)
    return res.status(500).json({ error: 'Failed to fetch user and/or project data! Please try again later.' })
  if (!projectData.collaborators.some(({ userId }) => userData.userId == userId))
    return res.status(401).json({ error: 'User needs to be added to the project!' });
  if (projectData.files.some(({ fileName }) => fileName == body.fileName))
    return res.status(400).json({ error: 'Project already has a file with the same name! Choose a different name and try again.' });
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
        connect: projectData.collaborators.map(({ userId }) => { return { userId } }),
      },
      project: {
        connect: {
          projectId: query.projectId,
        },
      },
      edits: [{ userId: userData.userId, on: Date.now().toString() }],
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ fileId: `${file.fileId}` });
}

export default withApiAuthRequired(addFile);