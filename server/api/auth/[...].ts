import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from "@prisma/client";
//@ts-expect-error
import bcrypt from 'bcrypt'

const config = useRuntimeConfig()

const prisma = new PrismaClient()

export default NuxtAuthHandler({
    secret: config.AUTH_SECRET,
    callbacks: {
        jwt: async ({token, user}) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user ? user.id || '' : '';
                token.side = user ? (user as any).side || '' : '';
              }
              return Promise.resolve(token);
        },
        session: async ({session, token}) => {
            (session as any).user.side = token.side;
            (session as any).user.uid = token.id;
            return Promise.resolve(session);
        },
    },
    providers: [
        //@ts-expect-error
        CredentialsProvider.default({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: '' },
                password: { label: 'Password', type: 'password', placeholder: '' }
            },
            async authorize (credentials: any, req: any) {
                const prisma = new PrismaClient()
                const user = await prisma.User.findFirst({where: {name: credentials.username}});
                console.log(user)     
                if (user) {
                    console.log(bcrypt.compareSync(credentials.password, user.password))
                    if (bcrypt.compareSync(credentials.password, user.password)) {
                        const u = {
                            id: user.id,
                            name: user.name,
                            side: user.side
                        }
                        return u
                    }
                    else return null
                }
                else return null
            }
        })
    ]
})