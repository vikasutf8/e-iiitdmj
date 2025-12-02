
import { title } from "process";
import swaggerAutogen from "swagger-autogen";

const doc ={
    info:{
        title:"e-Shop Products API",
        version:"1.0.0",
        description:"e-Shop APIs",
    },
    host:"localhost:6002",
    basePath:"/api/v1",
    schemes:["http"],
}

const outputFile ="./swagger-output.json";
const endPointsFile =["./routes/product.route.ts"];


swaggerAutogen()(outputFile,endPointsFile,doc);
