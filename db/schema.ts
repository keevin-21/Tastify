import { pgTable, serial, text, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const courseRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),    
});

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]); // type of challenge

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengesOptions: many(challengesOptions),
    challengeProgress: many(challengeProgress),
}));

export const challengesOptions = pgTable("challenges_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});

export const challengesOptionsRelations = relations(challengesOptions, ({ one }) => ({
    lesson: one(challenges, {
        fields: [challengesOptions.challengeId],
        references: [challenges.id],
    }),
}));

export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // TODO: confirm if this does not break lol
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    lesson: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),
}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("user"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.png"),
    activeCourseId: integer("active_course_id").references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(5),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));