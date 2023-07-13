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
    secret: config.authSecret,
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
                        return {
                            name: user.username,
                            email: user.side
                        }
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