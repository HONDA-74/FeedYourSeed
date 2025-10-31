
export const generateMessages= (entity) => {
        return {
            notFound : `${entity} not found`,
            alreadyExist : `${entity} already exist`,
            Created : `${entity} created successfully`,
            found : `${entity} found successfully`,
            Deleted : `${entity} deleted successfully`,
            Updated : `${entity} updated successfully`,
            notCreated : `${entity} created falid`,
            notFound : `${entity} found falid`,
            notDeleted : `${entity} deleted falid`,
            notUpdated : `${entity} updated falid`,
            invalidCrad : `Invalid cradinials`, 
            emailActivate : `Email not activated yet please activate it first and try again`,
            emailVerify : `Email verified successfully`,
            emailAlreadyExist : `Email already exist`,
        }
}
export const messages = {
    user : generateMessages("User"),
    shop : generateMessages("Product"),
    Product : generateMessages("Product"),
    cart : generateMessages("cart"),
    cartItem : generateMessages("Cart item")
}