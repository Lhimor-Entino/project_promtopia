import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDb } from "@/utils/database";
import User from "@models/users";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      //serverless function (LAMBDA 'OPENS UP ONLY WHEN CALLED')
      try {
        await connectToDb();

        //CHECK IF USER  EXIST
        const userExist = await User.findOne({
          email: profile.email,
        });

        if (!userExist) {
          //CREATE USER
          await User.create({
            email: profile.email,
            username: profile.name.replace("", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
