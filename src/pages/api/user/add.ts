import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';
import { UserData } from "@/types/modelTypes";

async function addUser(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method != 'POST')
    return res.status(405).json({ error: 'This route only supports POST requests!' });
  // @ts-ignore
  const { user } = await getSession(req, res);
  await conn.$connect();
  const existingUser: UserData | null = await conn.user.findFirst({
    where: {
      userName: user.nickname
    }
  });
  if (!existingUser) {
    await conn.user.create({
      data: {
        userName: user.nickname,
        email: user.email,
      },
    });
  }
  await conn.$disconnect();
  return res.status(200).json({ data: `Added user ${user.nickname} to mongo atlas!` });
}

export default withApiAuthRequired(addUser);