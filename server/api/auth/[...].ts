import { NuxtAuthHandler } from '#auth'
import CredentialsProvider from 'next-auth/providers/credentials'
//@ts-expect-error
import bcrypt from 'bcrypt'
import { users } from '../../models'

const config = useRuntimeConfig()

interface Credentials {
    username: string,
    password: string
}

interface User extends Credentials {
    _id: string
    side: string,
    createdAt: Date,
    updatedAt: Date
}

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
            (session as any).side = token.side;
            (session as any).uid = token.id;
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
            async authorize (credentials: Credentials, req: any) {
                const user: User | null = await users.findOne({username: credentials.username})
                if (user) {
                    if (credentials?.username === user.username && bcrypt.compareSync(credentials?.password, user.password)) {
                        // Any object returned will be saved in `user` property of the JWT .slice(13,37)
                        const u = {
                            id: user._id.toString(),
                            name: user.username,
                            side: user.side
                        }
                        return u;
                        } else {
                        // eslint-disable-next-line no-console
                        console.error('Warning: Malicious login attempt registered, bad credentials provided \n', req)
                        // If you return null then an error will be displayed advising the user to check their details.
                        return null
                        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                        }
                }
                else return null
            }
        })
    ]
})