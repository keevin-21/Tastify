import { relations } from "drizzle-orm/relations";
import { courses, userProgress, units, challenges, challengeProgress, challengesOptions, lessons } from "./schema";

export const userProgressRelations = relations(userProgress, ({one}) => ({
	course: one(courses, {
		fields: [userProgress.activeCourseId],
		references: [courses.id]
	}),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	userProgresses: many(userProgress),
	units: many(units),
}));

export const unitsRelations = relations(units, ({one, many}) => ({
	course: one(courses, {
		fields: [units.courseId],
		references: [courses.id]
	}),
	lessons: many(lessons),
}));

export const challengeProgressRelations = relations(challengeProgress, ({one}) => ({
	challenge: one(challenges, {
		fields: [challengeProgress.challengeId],
		references: [challenges.id]
	}),
}));

export const challengesRelations = relations(challenges, ({one, many}) => ({
	challengeProgresses: many(challengeProgress),
	challengesOptions: many(challengesOptions),
	lesson: one(lessons, {
		fields: [challenges.lessonId],
		references: [lessons.id]
	}),
}));

export const challengesOptionsRelations = relations(challengesOptions, ({one}) => ({
	challenge: one(challenges, {
		fields: [challengesOptions.challengeId],
		references: [challenges.id]
	}),
}));

export const lessonsRelations = relations(lessons, ({one, many}) => ({
	challenges: many(challenges),
	unit: one(units, {
		fields: [lessons.unitId],
		references: [units.id]
	}),
}));