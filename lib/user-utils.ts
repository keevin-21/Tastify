import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq, ne } from "drizzle-orm";

/**
 * Generate a unique username by checking existing usernames in the database
 * and appending a number if necessary
 */
export async function generateUniqueUsername(
  baseUsername: string, 
  currentUserId: string
): Promise<string> {
  // Clean the base username
  const cleanBase = baseUsername.trim() || "User";
  
  // Check if the base username is already unique
  const existingUsers = await db.query.userProgress.findMany({
    where: ne(userProgress.userId, currentUserId),
    columns: { userName: true }
  });
  
  const existingUsernames = existingUsers.map(u => u.userName.toLowerCase());
  
  // If the base username is unique, return it
  if (!existingUsernames.includes(cleanBase.toLowerCase())) {
    return cleanBase;
  }
  
  // Otherwise, find a unique variant
  let counter = 1;
  let uniqueUsername = `${cleanBase} ${counter}`;
  
  while (existingUsernames.includes(uniqueUsername.toLowerCase())) {
    counter++;
    uniqueUsername = `${cleanBase} ${counter}`;
  }
  
  return uniqueUsername;
}

/**
 * Format a display name for the leaderboard with additional distinguishing info
 */
export function formatLeaderboardDisplayName(
  userName: string, 
  userId: string, 
  activeCourse?: { title: string }
): string {
  const shortId = userId.slice(-4);
  const courseInfo = activeCourse ? ` • ${activeCourse.title}` : "";
  return `${userName} #${shortId}${courseInfo}`;
} 