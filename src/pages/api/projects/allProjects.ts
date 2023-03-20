import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import conn from '@/utils/conn';
import { UserDataWithProjects } from "@/types/modelTypes";

async function getAllProjects(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  // @ts-ignore
  const { user } = await getSession(req, res);
  if (method != 'GET')
    return res.status(405).json({ error: 'This route only supports GET requests!' });
  await conn.$connect();
  const userData: UserDataWithProjects | null = await conn.user.findUnique({
    where: {
      userName: user.nickname,
    },
    include: {
      projects: {
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
        },
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ body: { projects: userData?.projects } });
}

export default withApiAuthRequired(getAllProjects);