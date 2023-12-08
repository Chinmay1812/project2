import { BadRequestError } from "./appError.js";

export function jsonToObj(json,name){
    let obj = {};
    try{
        obj = JSON.parse(json);
    }catch(err){
        throw new BadRequestError("Invalid JSON format in "+name,err)
    }
    return obj;
}
export default function addToQuery(query,params,fields){
    fields.forEach(field => {
        if(params[field] === undefined) return;
        query[field](jsonToObj(params[field],field));
    })
    return query;
}