import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import conn from '@/utils/conn';
import { UserDataWithFiles } from "@/types/modelTypes";

async function getAllFiles(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  // @ts-ignore
  const { user } = await getSession(req, res);
  if (method != 'GET')
    return res.status(405).json({ error: 'This route only supports GET requests!' });
  await conn.$connect();
  const userData: UserDataWithFiles = await conn.user.findUnique({
    where: {
      userName: user.nickname,
    },
    include: {
      contributions: {
        include: {
          creator: {
            select: {
              userId: true,
              userName: true,
            },
          },
          project: {
            select: {
              projectId: true,
              projectName: true,
            },
          },
        },
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ body: { files: userData?.contributions } });
}

export default withApiAuthRequired(getAllFiles);