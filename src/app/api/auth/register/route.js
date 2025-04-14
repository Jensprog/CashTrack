
import { createUser } from "@/lib/auth";
import { generateToken } from "@/lib/auth";
import { ValidationError } from "@/errors/classes";
import { successResponse, errorResponse } from "@/helpers/api";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate email-format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError("Ogiltig e-postadress");
        }

        // Validate password strength
        if (password.length < 8) {
            throw new ValidationError("Lösenordet måste vara minst 8 tecken långt");
        }

        // Create user
        const newUser = await createUser(email, password);

        // Generate JWT token
        const token = generateToken(newUser.id);

        // Return success response
        return successResponse(
            { user: newUser, token },
            "Registreringen lyckades! Du kan nu logga in.",
            201
        );
    } catch (error) {
        return errorResponse(error);
    }
}