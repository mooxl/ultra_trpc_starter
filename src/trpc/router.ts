import { initTRPC } from "@trpc/server";
import { z } from "zod";
const t = initTRPC.create();

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "KATT",
  },
  {
    id: "hallo",
    name: "Simon Waigand",
  },
];

export const appRouter = t.router({
  userById: t.procedure.input(z.string()).query((req) => {
    const input = req.input;
    const user = userList.find((it) => it.id === input);
    return user;
  }),
});

export type AppRouter = typeof appRouter;
