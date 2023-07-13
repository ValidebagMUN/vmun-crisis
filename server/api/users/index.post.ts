import { users } from "../../models";

interface IRequestBody {
  username: string;
  password: string;
  side: string;
}

export default defineEventHandler(async (event) => {
  console.log("POST /api/users");
  const { username, password, side } = await readBody<IRequestBody>(event);
  try {
    const userData = await users.findOne({
      username,
    });
    if (userData) {
      console.log(`User with username ${username} already exists`);
      event.node.res.statusCode = 409;
      return {
        code: "USER_EXISTS",
        message: "User with given username already exists.",
      };
    } else {
      console.log("Create user");
      const newUserData = await users.create({
        username,
        password,
        side
      });
      return {
        id: newUserData._id,
        username: newUserData.username,
        side: newUserData.side
      };
    }
  } catch (err) {
    console.dir(err);
    event.node.res.statusCode = 500;
    return {
      code: "ERROR",
      message: "Something wrong.",
    };
  }
});