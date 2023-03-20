import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import conn from '@/utils/conn';

async function getFavFiles(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  // @ts-ignore
  const { user } = await getSession(req, res);
  if (method != 'GET')
    return res.status(405).json({ error: 'This route only supports GET requests!' });
  await conn.$connect();
  const files = await conn.user.findUnique({
    where: {
      userName: user.nickname
    },
    select: {
      favFiles: {
        select: {
          fileId: true,
          fileName: true,
        },
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ files: files?.favFiles });
}

export default withApiAuthRequired(getFavFiles);