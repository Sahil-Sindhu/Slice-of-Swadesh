import { Order } from "../models/Order";

export const generateOrderNumber = async (session?: any): Promise<string> => {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                    (today.getMonth() + 1).toString().padStart(2, '0') +
                    today.getDate().toString().padStart(2, '0');
    
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    
    const count = await Order.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }).session(session);

    const sequenceNum = (count + 1).toString().padStart(4, '0');
    return `SOS-${dateStr}-${sequenceNum}`;
};
