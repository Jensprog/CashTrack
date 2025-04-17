/**
 * Backend API route for user login.
 * 
 * This route handles user login by accepting an email and password,
 * validating the credentials, and returning a JWT token for authentication.
 */
import { getUserByEmail } from "@/services/userService";
import { comparePassword, generateToken } from "@/lib/auth";
import { AuthenticationError } from "@/errors/classes";
import { successResponse, errorResponse } from "@/helpers/api";

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        
        // Check if email exists
        const user = await getUserByEmail(email);
        if (!user) {
            throw new AuthenticationError("Ogiltig e-postadress eller lösenord");
        }
        
        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError("Ogiltig e-postadress eller lösenord");
        }
        
        // Generate JWT token
        const token = generateToken(user.id);
        
        // Return success response with token and user (excluding password)
        const { password: _, ...userWithoutPassword } = user;

        return successResponse(
            { user: userWithoutPassword, token },
            "Inloggning lyckades!",
            200
        );
    } catch (error) {
        return errorResponse(error);
    }
}