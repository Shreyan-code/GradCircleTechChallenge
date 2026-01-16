import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Pet, Post } from '@/lib/types';

export function useUserProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        const userData = userDoc.data() as User;
        setUser(userData);

        const petsColRef = collection(db, `users/${userId}/pets`);
        const petsSnapshot = await getDocs(petsColRef);
        const userPets = petsSnapshot.docs.map(doc => ({ petId: doc.id, ...doc.data() } as Pet));
        setPets(userPets);

        const postsColRef = collection(db, `posts`);
        const postsSnapshot = await getDocs(postsColRef);
        const userPosts = postsSnapshot.docs
          .map(doc => ({ postId: doc.id, ...doc.data() } as Post))
          .filter(post => post.userId === userId);
        setPosts(userPosts);

      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, updatedData);
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : null);
  };

  return { user, pets, posts, loading, error, updateUserProfile };
}
