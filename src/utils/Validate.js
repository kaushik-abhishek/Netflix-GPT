export const CheckValidateData = (name, email, password) => {
    //const isNameValid = /^([A-Za-z]+)$/.test(name);
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isPasswordValid = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/.test(password);
   
    //if(!isNameValid) return "Name is not valid";
    if(!isEmailValid) return "Email ID is not Valid";
    if(!isPasswordValid) return "Password is not valid";
    

    return null;

}