import { PrismaClient } from "@prisma/client";

declare global {
  var __conn: PrismaClient;
}

let conn: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  conn = new PrismaClient();
} else {
  if (global.__conn == undefined) {
    global.__conn = new PrismaClient();
  }
  conn = global.__conn;
}

export default conn;