import * as crypto from 'crypto-js';

export class Asset {

   static encrypt(value : object, secretNumber: string) : string{
        let secret = this.makeSecret(secretNumber)
        let d = {secret: secret, value: value}
    
        let code = JSON.stringify(d)
        let data = {secret: secret, code: crypto.AES.encrypt(code.trim(), secret.trim()).toString().replace(/\//g,'atala')}
        data['link'] = data.code
        return data['link'];
      }
    
   static  makeSecret(secret: string) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return 'atala%'+secret;
     }
    
     static decrypt(textToDecrypt : string, secretNumber:string){
        let secret = this.makeSecret(secretNumber)
        let data = crypto.AES.decrypt(textToDecrypt.replace(/atala/g,'/'), secret.trim()).toString(crypto.enc.Utf8);
    
        if(!data) {
          return null
        }
        
        data = JSON.parse(data)
        return data
       }

}
