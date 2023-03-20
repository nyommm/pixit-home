import { Prisma } from '@prisma/client';

// ***** USER TYPES *****
const userData = Prisma.validator<Prisma.UserArgs>()({
  select: { userId: true, userName: true, email: true, createdDate: true, updatedDate: true, },
});

export type UserData = Prisma.UserGetPayload<typeof userData> | null;

const userDataWithFavFiles = Prisma.validator<Prisma.UserArgs>()({
  include: {
    favFiles: {
      select: {
        fileId: true,
        fileName: true,
      },
    },
  },
});

export type UserDataWithFavFiles = Prisma.UserGetPayload<typeof userDataWithFavFiles> | null;

const userDataWithProjects = Prisma.validator<Prisma.UserArgs>()({
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

export type UserDataWithProjects = Prisma.UserGetPayload<typeof userDataWithProjects> | null;

const userDataWithFiles = Prisma.validator<Prisma.UserArgs>()({
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

export type UserDataWithFiles = Prisma.UserGetPayload<typeof userDataWithFiles> | null;

const userDataComplete = Prisma.validator<Prisma.UserArgs>()({
  include: {
    createdProjects: {
      select: {
        projectId: true,
        projectName: true,
      },
    },
    ownedProjects: {
      select: {
        projectId: true,
        projectName: true,
      },
    },
    createdFiles: {
      select: {
        fileId: true,
        fileName: true,
      },
    },
    contributions: {
      select: {
        fileId: true,
        fileName: true,
      },
    },
  }
});

export type UserDataComplete = Prisma.UserGetPayload<typeof userDataComplete> | null;

// ***** FILE TYPES *****
const fileData = Prisma.validator<Prisma.FileArgs>()({
  select: { fileId: true, fileName: true, createdDate: true, updatedDate: true, },
});

export type FileData = Prisma.FileGetPayload<typeof fileData> | null;

const fileDataWithProject = Prisma.validator<Prisma.FileArgs>()({
  include: {
    project: {
      select: {
        projectId: true,
        projectName: true,
      },
    },
  },
});

export type FileDataWithProject = Prisma.FileGetPayload<typeof fileDataWithProject> | null;

const fileDataComplete = Prisma.validator<Prisma.FileArgs>()({
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

export type FileDataComplete = Prisma.FileGetPayload<typeof fileDataComplete> | null;

// ***** PROJECT TYPES *****
const projectData = Prisma.validator<Prisma.ProjectArgs>()({
  select: { projectId: true, projectName: true, createdDate: true, updatedDate: true },
});

export type ProjectData = Prisma.ProjectGetPayload<typeof projectData> | null;

const projectDataComplete = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    owner: {
      select: {
        userId: true,
        userName: true,
      },
    },
    creator: {
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
        createdDate: true,
        updatedDate: true,
      },
    },
  },
});

export type ProjectDataComplete = Prisma.ProjectGetPayload<typeof projectDataComplete> | null;