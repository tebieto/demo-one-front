export class CustomErrorHandler {


    static ConnectionError(error: any){

      if(error.responseCode && error.responseCode=='99'){
      return  this.fetchErrorMessage(error)
      }

        if(!this.internetConnection()){
          return'No internet connection'
          
        }
    
        else if(error.status==404 && error.body){

          return error.body
    
        }

        else if(error.status==401 && error.body){

          return error.body
    
        }
    
        else if(error.status==500){
    
            return'Internal server error'
      
          }
          
        else if(error.status==400){
            let message =  JSON.parse(error._body)

            if (message.sql){
              return message.sql.Message
            }
            return'Bad request'
      
          }else {
    
          return 'Could not Establish a connection'
    
        }

    
      }

    static  fetchErrorMessage(result:  object){
        let err = result['errors']
        err = err[Object.keys(err)[0]];
        return err
    }

    static internetConnection(){
        if (navigator.onLine) {
          return true
        } else {
          return false
        }
      }
}
