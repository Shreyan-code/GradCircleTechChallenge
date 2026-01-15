// This is a placeholder API route for development.
// In a real application, you would use a database.
// As we can't write to the filesystem from a serverless function on Vercel/Firebase,
// this will only work in a local development environment where the filesystem is writable.

import { promises as fs } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';
import { type User } from '@/lib/types';

// This is not a production-ready solution.
// It's a way to simulate database writes for the purpose of this demo.
async function updateMockData(newUser: User) {
  const filePath = path.join(process.cwd(), 'src', 'lib', 'mock-data.ts');
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    // This is a very brittle way to update the mock data file.
    // It finds the `users:` array and injects the new user.
    const newUserString = `\n    {\n      userId: "${newUser.userId}",
      email: "${newUser.email}",
      password: "${newUser.password}",
      displayName: "${newUser.displayName}",
      photoURL: "${newUser.photoURL}",
      location: { city: "${newUser.location.city}", state: "${newUser.location.state}", country: "${newUser.location.country}" },
      bio: "${newUser.bio}",
      joinedAt: "${newUser.joinedAt}",
      postCount: ${newUser.postCount},
      petCount: ${newUser.petCount},
      followers: ${newUser.followers},
      following: ${newUser.following},
      petIds: []
    },`;

    const usersRegex = /users: \[([^\]]*)\]/s;
    const match = fileContent.match(usersRegex);

    if (match) {
      const updatedUsersArray = `users: [${match[1].trim()}${newUserString}\n  ]`;
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
    const body: Omit<User, 'userId'> = await req.json();
    
    // Simulate getting existing users to generate a new ID
    const filePath = path.join(process.cwd(), 'src', 'lib', 'mock-data.ts');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    // This is a crude way to count existing users from the raw text file
    const userCount = (fileContent.match(/userId: "user_/g) || []).length;
    
    const newUser: User = {
        ...body,
        userId: `user_${String(userCount + 1).padStart(3, '0')}`,
    };
    
    await updateMockData(newUser);

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'An error occurred' }, { status: 500 });
  }
}
