import { Request, Response } from "express";
import * as admin from 'firebase-admin';
import { GetSignedUrlConfig } from '@google-cloud/storage';
import * as firebaseHelper from 'firebase-functions-helper';

const db = admin.firestore();
const bucketx = admin.storage().bucket();
const optionsx: GetSignedUrlConfig = {
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60
};
export async function vehicledetail(req: Request, res: Response) {
    const { country,id } = req.params;
    const pathx='/vehicles/'+country+'/list';
    const queryArray = [['idrcm', '==', id]];
    firebaseHelper.firestore.queryData(db,pathx,queryArray)
    .then(doc => {
        const result:any[]=new Array;
        for(const key of Object.keys(doc)) {
            result.push(doc[key]);
        }
        res.status(200).send(result);
    })
    .catch(error => res.status(500).send('data not found '+error));
};
export async function vehicleall(req: Request, res: Response) {
    const promise=new Promise(function(resolve, reject) {
        firebaseHelper.firestore
        .backup(db, 'vehicles')
        .then(doc => resolve(doc))
        .catch(error => resolve(error));
    });
    const promise1=new Promise(function(resolve, reject) {
        firebaseHelper.firestore
        .backup(db, 'vehicles/nz/list')
        .then(doc => resolve(doc))
        .catch(error => resolve(error));
    });
    const promise2=new Promise(function(resolve, reject) {
        firebaseHelper.firestore
        .backup(db, 'vehicles/au/list')
        .then(doc => resolve(doc))
        .catch(error => resolve(error));
    });
    await Promise.all([promise,promise1,promise2]).then(function(values) {
        const feedback= new Array();
        const result=new Array();
        
        feedback.push(values[1]);
        feedback.push(values[2]);
        let p:any;
        p=feedback;
        console.log(values[0]);
        for (const key of Object.keys(p)) {
            console.log('key:'+key);
            for(const key2 in p[key]) {
                console.log('key2:'+key2);
                for(const key3 in p[key][key2]){
                    /*var ct = { 
                        countrycode:"nz", 
                        country:"New Zealand" 
                     };*/
                     const test=p[key][key2][key3];
                    //p[key][key2][key3].push(ct);
                    //test.push(ct);
                    result.push(test);
                }
            }
        }
        res.send(result);
    });
    
    
}


export async function getthumbnail(req: Request, res: Response) {  
    const { country,locimg } = req.params
    const loc='galleries/'+country+'/'+locimg+'/0.jpg';
    const imageFileRef = bucketx.file(loc);
    imageFileRef.exists()
    .then(rs => {
        if(rs[0]===true){
            imageFileRef.getSignedUrl(optionsx)
            .then(urlx => {
                res.status(200).send(urlx);
            }).catch(error => {
                res.status(500).send(error);
            });
        } else {
            res.status(500).send('image not found');
        }
        
      })
      .catch(error => {
        res.status(500).send(error);
      });
}
/*export async function getimagesx(req: Request, res: Response) {
    const options = {
        prefix: 'au/galleries/'
      };
      const [files] = await bucketx.getFiles(options);
      const endFiles = files.filter( h => h.name.includes('jpg') );
      const promises = [];
      for (let i = 0; i < endFiles.length; i++) {
        console.log(endFiles[i].name);
        promises.push(endFiles[i].getSignedUrl(optionsx));
      }
  
      const urlsArray = await Promise.all(promises);  
  
      res.send(urlsArray);

}*/