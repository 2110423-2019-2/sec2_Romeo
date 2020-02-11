
export const editCurrentClient = (client) => {
    localStorage.setItem("currentClient", JSON.stringify(client));
}
export const getCurrentClient = () => {
    return JSON.parse(localStorage.getItem("currentClient"));
}
    
export const mockValues = () => {
    return {
        username: "prawsang",
        password: "password",
        email: "prawcha.p@gmail.com",
        firstName: "Prawsang",
        lastName: "Chayakulkeeree",
        ssn: "1234567890123",
        bankAccountNumber: "025-3-13080-6",
        bankName: "Kasikorn Thai",
        bankAccountName: "Prawsang Chayakulkeeree",
        phone: "0820960005",
        equipment: ["Canon Something", "Flash"]
    }
}


