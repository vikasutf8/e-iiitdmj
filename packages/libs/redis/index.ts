
import Redis from "ioredis";

// const redis =new Redis({
//     host:process.env.REDIS_HOST || "127.0.0.1",
//     port:Number(process.env.REDIS_PORT )|| 6379,
//     password:process.env.REDIS_PASSWORD ,
// })


//debug  :npm nx reset cache
// console.log("REDIS DATEBASE URI",process.env.REDIS_DATEBASE_URI);


const redis = new Redis(process.env.REDIS_DATEBASE_URI!);



export default redis;