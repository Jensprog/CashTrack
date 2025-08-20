/**
 * @file Validation helper functions for user input.
 * Collection of functions to validate user input for registration and login.
 */

/**
 * Validates the username format.
 * @param {string} username - Username to validate.
 * @returns {object} - An object containing isValid and perhaps error message.
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[0-9a-zA-Z]{4,20}$/;

  if (!username) {
    return { isValid: false, message: 'Användarnamn krävs' };
  }

  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Användarnamnet måste vara mellan 4 och 20 tecken långt och får endast innehålla bokstäver och siffror.' };
  }

  return { isValid: true };
};

  /**
   * Validates the email format.
 * @param {string} email - Email address to validate.
 * @return {object} - An object containing isValid and perhaps error message.
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, message: 'E-postadress krävs' };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Ange en giltig e-postadress' };
  }

  return { isValid: true };
};

/**
 * Validates the password strength.
 * @param {string} password - Password to validate.
 * @return {object} - An object containing isValid and perhaps error message.
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Lösenord krävs' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Lösenordet måste vara minst 8 tecken långt' };
  }

  return { isValid: true };
};

/**
 * Validate if two passwords match.
 * @param {string} password - First password.
 * @param {string} confirmPassword - Second password.
 * @return {object} - An object containing isValid and perhaps error message.
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Lösenorden matchar inte' };
  }

  return { isValid: true };
};

/**
 * Validate a complete registration form.
 * @param {object} formData - Form data to validate.
 * @returns {object} - An object containing isValid and perhaps error message.
 */
export const validateRegistrationForm = ({ username, email, password, confirmPassword }) => {
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.isValid) {
    return usernameValidation;
  }

  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
  if (!passwordMatchValidation.isValid) {
    return passwordMatchValidation;
  }

  return { isValid: true };
};

/**
 * Validate a login form.
 * @param {object} formData - Form data to validate.
 * @returns {object} - An object containing isValid and perhaps error message.
 */
export const validateLoginForm = ({ email, password }) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  if (!password) {
    return { isValid: false, message: 'Lösenord krävs' };
  }

  return { isValid: true };
};
