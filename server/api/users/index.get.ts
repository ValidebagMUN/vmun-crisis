import { users } from '../../models'

export default defineEventHandler(async (event) => {
    console.log("GET /api/users");
    try {
      console.log("Find users");
      const usersData = await users.find();
      return usersData.map((user: typeof users) => ({
        id: user._id,
        username: user.username,
        side: user.side
      }));
    } catch (err) {
      console.dir(err);
      event.node.res.statusCode = 500;
      return {
        code: "ERROR",
        message: "Something went wrong.",
      };
    }
  });