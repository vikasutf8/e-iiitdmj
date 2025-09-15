/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */

// import { PrismaClient } from '../../../generated/prisma';
import { PrismaClient } from '@prisma/client'; 
declare global {
    namespace globalThis{
        var prisma:PrismaClient;
    }
}

 const prisma = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') global.prisma = prisma;



    export default prisma;