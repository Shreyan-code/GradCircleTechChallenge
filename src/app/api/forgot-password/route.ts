// This is a placeholder API route for development.
// In a real application, you would use a database.
// As we can't write to the filesystem from a serverless function on Vercel/Firebase,
// this will only work in a local development environment where the filesystem is writable.

import { promises as fs } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';

// This is not a production-ready solution.
// It's a way to simulate database writes for the purpose of this demo.
async function updateMockData(email: string, newPassword?: string) {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'mock-data.ts');
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    // This is a very brittle way to update the mock data file.
    // It finds the user by email and replaces their password.
    const usersRegex = /users: \[([^\]]*)\]/s;
    const match = fileContent.match(usersRegex);

    if (match) {
      // Crude parsing of the users array from the string
      // WARNING: This is very fragile and depends on the exact formatting.
      const usersArrayString = match[1];
      const userObjects = usersArrayString.split(/},?\s*{/).map((s, i, arr) => {
        let str = s.trim();
        if (i > 0) str = '{' + str;
        if (i < arr.length - 1 && !str.endsWith('}')) str = str + '}';
        return str;
      });

      let userFound = false;
      const updatedUserObjects = userObjects.map(userStr => {
        if (userStr.includes(`email: "${email}"`)) {
          userFound = true;
          // Replace the password property
          if (newPassword) {
            return userStr.replace(/password: ".*?"/, `password: "${newPassword}"`);
          }
          return userStr;
        }
        return userStr;
      });

      if (!userFound) {
        throw new Error('User not found');
      }

      const updatedUsersArray = `users: [${updatedUserObjects.join(',\n    ')}\n  ]`;
      const updatedFileContent = fileContent.replace(usersRegex, updatedUsersArray);
      
      await fs.writeFile(filePath, updatedFileContent, 'utf8');
    } else {
        throw new Error('Could not find users array in mock-data.ts');
    }

  } catch (error) {
    console.error('Failed to update mock-data.ts:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ message: 'This API route is for development only.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
        return NextResponse.json({ message: 'Email and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
        return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
    }
    
    await updateMockData(email, newPassword);

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
  }
}
