/**
 * @file Logic for the greeting message when a user logs in. 
 * - Message will vary depending on the time of day. 
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useGreetingMessage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (user) {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        setGreeting(`God morgon, ${user.username}!`);
      } else if (currentHour < 18) {
        setGreeting(`God eftermiddag, ${user.username}!`);
      } else {
        setGreeting(`God kväll, ${user.username}!`);
      }
    }
  }, [user]);

  return greeting;
}
