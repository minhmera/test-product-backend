 function isUserNameError(str){
    if (str !== undefined) {
        let regex = /[!@#$%^&*()_ +\-=\[\]{};':"\\|,.<>\/?]/g;
        return regex.test(str);
    } else {
        return false
    }
}

 function isFullNameError(str){
     if (str !== undefined) {
         let regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
         return regex.test(str);
     } else {
         return false
     }

 }


 function isShopPathError(str){
     if (str !== undefined) {
         let regex = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g;
         return regex.test(str);
     } else {
         return false
     }

 }

 module.exports = {
     isUserNameError,isFullNameError,isShopPathError
 }
