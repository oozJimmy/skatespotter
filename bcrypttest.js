const bcrypt = require('bcrypt')
const pass = 'B1ngo!'
const pass2 = 'Gorg3Breaker';

(async () => {
    try{
        const hashedPassword = await bcrypt.hash(pass, 10) //Store hashed pass in database (SIGNUP)
        const hashedPassword2 = await bcrypt.hash(pass2, 10)
        
        var compareResult = await bcrypt.compare(pass, hashedPassword) //Hashed password from database, pass from login request (LOGIN)
        var compareResult2 = await bcrypt.compare(pass2, hashedPassword2)

        console.log(hashedPassword)
        console.log(hashedPassword2)
        console.log('1.',compareResult)
        console.log('2.',compareResult2)
    }catch{
        console.log(error)
    }
})()
