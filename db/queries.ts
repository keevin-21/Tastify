import { cache } from "react";
import db from "./drizzle";

// get all courses
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();

    return data;
});