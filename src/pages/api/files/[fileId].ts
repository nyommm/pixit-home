import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';
import { FileDataComplete } from '@/types/modelTypes';

async function getFileById(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  if (!query || typeof query.fileId !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid file Id!' });
    // @ts-ignore
  const { user } = await getSession(req, res);
  await conn.$connect();
  const file: FileDataComplete = await conn.file.findUnique({
    where: {
      fileId: query.fileId,
    },
    include: {
      project: {
        select: {
          projectId: true,
          projectName: true,
        },
      },
      creator: {
        select: {
          userId: true,
          userName: true,
        },
      },
      contributors: {
        select: {
          userId: true,
          userName: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!file)
    return res.status(404).json({ error: `No file found with id ${query.projectId}` });
  if (!file.contributors.find(({ userName }) => userName === user.nickname))
    return res.status(401).json({
      error: `${user.nickname} doesn't have access to this file! Contact the file creator to get access to it.`
    });
  switch(method) {
    case 'GET':
      return res.status(200).json({ body: { file } });
    case 'DELETE':
      if (user.nickname != file.creator.userName)
        return res.status(401).json({ error: 'Only the creator of the file can delete it!' });
      await conn.$connect();
      await conn.file.delete({
        where: {
          fileId: query.fileId,
        },
      });
      await conn.$disconnect();
      return res.status(204).json({ data: `${file.fileName} deleted!` });
    default:
      return res.status(405).json({ error: 'This route only supports GET and DELETE requests!' });
  }
}

export default withApiAuthRequired(getFileById);