import { connectDB } from "./db/connection.js"
import authRouter from "./modules/auth/auth.controller.js"
import shopRouter from "./modules/shop/shop.controller.js"
import userRouter from "./modules/user/user.controller.js" 
import orderRouter from "./modules/order/order.controller.js"
import { globalHandler } from "./utils/error/global-error-handler.js"
import { invalidUrl } from "./utils/error/not-found-url.js"
const bootstrap = async (app , express , cors) =>{
    
    await connectDB()

    app.use(cors());
    app.use(express.static('public'));
    app.use(express.json())
    app.use("/auth" , authRouter )
    app.use("/user" , userRouter )
    app.use("/shop" , shopRouter )
    app.use("/order" , orderRouter)
    app.all("*" , invalidUrl )
    app.use( globalHandler )
}
export default bootstrap