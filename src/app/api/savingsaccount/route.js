/**
 * @file API route for managing savings accounts. 
 */

import {
   /* createSavingsAccount, */
    getUserSavingsAccounts,
   /* getSavingsAccountById, */
} from '@/services/savingsAccountService';
import { authMiddleware } from '@/middlewares/authMiddleware';
// import { ValidationError, NotFoundError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';

export async function GET(request) {
    try {
        const userId = await authMiddleware(request);
        
        if (userId instanceof Response) {
            return userId;
        }

        const savingsAccounts = await getUserSavingsAccounts(userId);
        
        return successResponse ({ savingsAccounts }, 'Sparkonton hämtade', 200);
    } catch (error) {
        return errorResponse(error);
    }
}



