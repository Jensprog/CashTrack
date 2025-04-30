/**
 * Manual unit tests.
 * 
 * This script tests the functions from the product backlog:
 * UT1-UT6: getUserByEmail, createUser, comparePassword, generateToken, verifyToken
 * 
 * Run: node -r next/dist/require-hook manualUnitTests.js
 */
import { getUserByEmail, createUser } from '@/services/userService'
import { comparePassword, hashPassword, generateToken, verifyToken } from '@/lib/auth';

// Helper functions to log the test result
function logTest(id, name, result, details = null) {
  console.log(`\n--- Test ${id}: ${name} ---`);
  console.log(`Status: ${result ? '✅ APPROVED' : '❌ FAILED'}`);
  if (details) {
    console.log('Details:', details);
  }
  console.log('-'.repeat(40));
}

export async function runTests() {
  console.log('====== MANUAL UNIT TESTS ======\n');
  
  try {
    // UT1: getUserByEmail with a valid email
    console.log('Testing UT1: getUserByEmail (valid email)');
    const user = await getUserByEmail('test@example.com');
    const ut1Result = user !== null && user.email === 'test@example.com';
    logTest('UT1', 'getUserByEmail (valid)', ut1Result, {
      email: user?.email,
      id: user?.id
    });

    // UT2: getUserByEmail with an invalid email
    console.log('Testing UT2: getUserByEmail (invalid email)');
    const nonExistentUser = await getUserByEmail('nonexistent@example.com');
    const ut2Result = nonExistentUser === null;
    logTest('UT2', 'getUserByEmail (invalid)', ut2Result, {
      returnedValue: nonExistentUser === null ? 'null' : typeof nonExistentUser
    });

    // UT3: createUser
    console.log('Testing UT3: createUser');
    const timestamp = new Date().getTime();
    const testEmail = `test_${timestamp}@example.com`;
    const newUser = await createUser(testEmail, 'password123');
    const ut3Result = newUser && newUser.id && newUser.email === testEmail;
    logTest('UT3', 'createUser', ut3Result, {
      email: newUser?.email,
      id: newUser?.id
    });

    // UT4: comparePassword
    console.log('Testing UT4: comparePassword with actual user');
    
    const testUser = await getUserByEmail('jens.karlsson@hotmail.com');

    let ut4Result = false;

    if (testUser && testUser.password) {
        const knownPassword = 'Webbprogrammering2024!';
        const isMatch = await comparePassword(knownPassword, testUser.password);
        const wrongMatch = await comparePassword('wrongpassword', testUser.password);
        ut4Result = isMatch === true && wrongMatch === false;

        logTest('UT4', 'comparePassword', ut4Result, {
            isMatch: isMatch,
            wrongMatch: wrongMatch,
            usingRealUserPassword: true
        });
    } else {
        console.log('Could not find test user for password comparison, using generated password instead');

        const plainPassword = 'password123';
        const hashedPassword = await hashPassword(plainPassword);
        const isMatch = await comparePassword(plainPassword, hashedPassword);
        const wrongMatch = await comparePassword('wrongpassword', hashedPassword);
        ut4Result = isMatch === true && wrongMatch === false;

        logTest('UT4', 'comparePassword', ut4Result, {
            isMatch: isMatch,
            usingGeneratedPassword: true
        });
    }

    // UT5: generateToken
    console.log('Testing UT5: generateToken');
    const userId = 'user123';
    const token = generateToken(userId);
    const ut5Result = typeof token === 'string' && token.length > 20 && token.split('.').length === 3;
    logTest('UT5', 'generateToken', ut5Result, {
      tokenStart: token ? `${token.substring(0, 15)}...` : null,
      isString: typeof token === 'string',
      hasThreeParts: token ? token.split('.').length === 3 : false
    });

    // UT6: verifyToken
    console.log('Testing UT6: verifyToken');
    const decoded = verifyToken(token);
    const invalidResult = verifyToken('invalid.token.here');
    const ut6Result = decoded && decoded.userId === userId && invalidResult === null;
    logTest('UT6', 'verifyToken', ut6Result, {
      decoded: decoded ? { userId: decoded.userId } : null,
      invalidTokenResult: invalidResult === null ? 'null (correct)' : invalidResult
    });

    // Test summary
    console.log('\n====== TEST SUMMARY ======');
    console.log('UT1 - getUserByEmail (valid):', ut1Result ? '✅ APPROVED' : '❌ FAILED');
    console.log('UT2 - getUserByEmail (invalid):', ut2Result ? '✅ APPROVED' : '❌ FAILED');
    console.log('UT3 - createUser:', ut3Result ? '✅ APPROVED' : '❌ FAILED');
    console.log('UT4 - comparePassword:', ut4Result ? '✅ APPROVED' : '❌ FAILED');
    console.log('UT5 - generateToken:', ut5Result ? '✅ APPROVED' : '❌ FAILED');
    console.log('UT6 - verifyToken:', ut6Result ? '✅ APPROVED' : '❌ FAILED');
    
    const totalPassed = [ut1Result, ut2Result, ut3Result, ut4Result, ut5Result, ut6Result].filter(Boolean).length;
    console.log(`\nTOTAL: ${totalPassed} of 6 tests approved`);
    
  } catch (error) {
    console.error('An error occured during testing:', error);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  runTests();
}