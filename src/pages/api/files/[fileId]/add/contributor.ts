import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';
import { UserData } from "@/types/modelTypes";

async function addUserToFile(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  if (method != 'PUT')
    return res.status(405).json({ error: 'This route only supports PUT requests!' });
  if (!query || typeof query.fileId !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid file id!' });
  if (!body || typeof body.userName !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid username!' });
  await conn.$connect();
  const existingUser: UserData | null = await conn.user.findUnique({
    where: {
      userName: body.userName,
    },
  });
  const fileData = await conn.file.findUnique({
    where: {
      fileId: query.fileId,
    },
    include: {
      contributors: {
        select: {
          userId: true,
          userName: true,
        },
      },
    },
  });
  await conn.$disconnect();
  if (!existingUser)
    return res.status(404).json({ error: `No user found with username  ${body.userName}!` });
  if (!fileData)
    return res.status(404).json({ error: `No file found with id  ${query.projectId}!` });
  if (fileData.contributors.some(({ userId }) => userId == existingUser.userId))
    return res.status(400).json({ error: `${body.userName} already has access to the file!` });
  await conn.$connect();
  await conn.file.update({
    where: {
      fileId: fileData.fileId,
    },
    data: {
      contributors: {
        connect: fileData.contributors
          .map(({ userId }) => { return { userId }; })
          .concat({ userId: existingUser.userId}),
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ data: `Added user ${body.userName} to file ${fileData.fileName}!` });
}

export default withApiAuthRequired(addUserToFile);