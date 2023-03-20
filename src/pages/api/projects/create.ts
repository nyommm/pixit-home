import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';

function validateProjectName(name: string): boolean {
  if (!/^[a-zA-Z0-9_-]{5,}$/.test(name)) return false;
  return true;
}

async function createProject(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;
  if (method != 'POST')
    return res.status(405).json({ error: 'This route only supports POST requests!' });
  if (!body || typeof body.projectName !== 'string' || !validateProjectName(body.projectName))
    return res.status(400).json({ error: 'Need a valid name to create a project!' });
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
          projectName: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!userData)
    return res.status(500).json({ error: 'Failed to fetch user data! Please try to create projects later.' });
  if (userData.projects.find(({ projectName }) => projectName == body.projectName))
    return res.status(400).json({ error: 'User is already added to a project with the same name!' });
  await conn.$connect();
  const newProject = await conn.project.create({
    data: {
      projectName: body.projectName,
      owner: {
        connect: {
          userId: userData.userId,
        }
      },
      creator: {
        connect: {
          userId: userData.userId,
        },
      },
      collaborators: {
        connect: {
          userId: userData.userId,
        },
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ projectId: `${newProject.projectId}` });
}

export default withApiAuthRequired(createProject);