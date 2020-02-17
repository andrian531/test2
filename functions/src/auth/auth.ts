import { Request, Response } from "express";
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper';

const db = admin.firestore();

export async function isAdmin(req: Request, res: Response , next: Function) {
    const { key } = req.params;
    firebaseHelper.firestore.getDocument(db,'user',key)
    .then(doc => {
        console.log(doc.accesslevel);
        let akses:number=0;
        let domainacc:number=0;
        let msg=new Array;
        const p=doc.domain;
        for(var i in p) {
            if(p[i]===extractUrl(req.get('Referer'))){
                domainacc=1;
            }
        }
        if(domainacc==0){
            msg.push("invalid domain ");
        }
        if(doc.accesslevel==="admin"){
            akses=1;
        } else {
            akses=0;
            msg.push("Your key cannot access this function");
        }
        if(akses==1 && domainacc==1){
            return next();
        } else {
            res.send(msg);
        }
        
    })
    .catch(error => res.send('key not found '));
}

function extractUrl(urlx:any){
    let pathArray = urlx.split( '/' );
    //var protocol = pathArray[0];
    let host = pathArray[2];
    let url = host;
    return url;
}