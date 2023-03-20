import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import conn from '@/utils/conn';
import { UserData } from "@/types/modelTypes";

async function addUserToProject(req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req;
  if (method != 'PUT')
    return res.status(405).json({ error: 'This route only supports PUT requests!' });
  if (!query || typeof query.projectId !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid project Id!' });
  if (!body || typeof body.userName !== 'string')
    return res.status(400).json({ error: 'Missing/Invalid username!' });
  await conn.$connect();
  const existingUser: UserData | null = await conn.user.findUnique({
    where: {
      userName: body.userName,
    },
  });
  const projectData = await conn.project.findUnique({
    where: {
      projectId: query.projectId,
    },
    include: {
      collaborators: {
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
  if (!projectData)
    return res.status(404).json({ error: `No project found with id  ${query.projectId}!` });
  if (projectData.collaborators.some(({ userId }) => userId == existingUser.userId))
    return res.status(400).json({ error: `${body.userName} is already added to the project!` });
  await conn.$connect();
  await conn.project.update({
    where: {
      projectId: projectData.projectId,
    },
    data: {
      collaborators: {
        connect: projectData.collaborators
          .map(({ userId }) => { return { userId }; })
          .concat({ userId: existingUser.userId}),
      },
    },
  });
  await conn.$disconnect();
  return res.status(200).json({ data: `Added user ${body.userName} to project ${projectData.projectName}` });
}

export default withApiAuthRequired(addUserToProject);