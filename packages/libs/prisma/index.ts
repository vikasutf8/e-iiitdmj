

// import { PrismaClient } from '../../../generated/prisma/client';


import { PrismaClient } from '@prisma/client';

declare global {
    namespace globalThis{
        var prisma:PrismaClient;
    }
}

const prisma = new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
console.log("PRISMA DATABASE URI",process.env.DATABASE_URI);


export default prisma;