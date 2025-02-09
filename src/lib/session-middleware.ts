import "server-only";

import { createMiddleware } from "hono/factory";
import {
  Client,
  Account,
  Databases,
  Storage,
  Models,
  type Account as AccountType,
  type Databases as DatabaseType,
  type Storage as StorageType,
  type Users as UserType,
} from "node-appwrite";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "@/features/auth/constants";

type ContextVariables = {
  Variables: {
    account: AccountType;
    databases: DatabaseType;
    storage: StorageType;
    users: UserType;
    user: Models.User<Models.Preferences>;
  };
};
export const sessionMiddleware = createMiddleware<ContextVariables>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE_NAME);
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    client.setSession(session);

    const account = new Account(client);
    const databases = new Databases(client);
    const storage = new Storage(client);

    const user = await account.get();

    c.set("user", user);
    c.set("databases", databases);
    c.set("storage", storage);
    c.set("account", account);

    await next();
  }
);
