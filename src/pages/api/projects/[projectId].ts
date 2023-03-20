import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';
import { ProjectDataComplete } from '@/types/modelTypes';

async function getProjectById(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  if (!query || typeof query.projectId !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid project Id!' });
  // @ts-ignore
  const { user } = await getSession(req, res);
  await conn.$connect();
  const project: ProjectDataComplete | null = await conn.project.findUnique({
    where: {
      projectId: query.projectId,
    },
    include: {
      creator: {
        select: {
          userId: true,
          userName: true,
        },
      },
      owner: {
        select: {
          userId: true,
          userName: true,
        },
      },
      collaborators: {
        select: {
          userId: true,
          userName: true,
        },
      },
      files: {
        select: {
          fileId: true,
          fileName: true,
          edits: true,
          createdDate: true,
          updatedDate: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!project)
    return res.status(404).json({ error: `No project found with id ${query.projectId}` });
  if (!project.collaborators.find(({ userName }) => userName === user.nickname))
    return res.status(401).json({
      error: `${user.nickname} is not added to this project! Contact the project owner to get added to this project.`
    });
  switch(method) {
    case 'GET':
      return res.status(200).json({ body: { project } });
    case 'DELETE':
      if (user.nickname != project.owner.userName)
        return res.status(401).json({ error: 'Only the project owner can delete the project!' });
      await conn.$connect();
      await conn.file.deleteMany({
        where: {
          projectId: query.projectId,
        },
      });
      await conn.project.delete({
        where: {
          projectId: query.projectId,
        },
      });
      await conn.$disconnect();
      return res.status(204).json({ data: `${project.projectName} deleted!` });
    default:
      return res.status(405).json({ error: 'This route only supports GET and DELETE requests!' });
  }
}

export default withApiAuthRequired(getProjectById);