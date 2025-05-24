import { pgTable, serial, text, foreignKey, integer, timestamp, boolean, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const type = pgEnum("type", ['SELECT', 'ASSIST'])


export const courses = pgTable("courses", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	imageSrc: text("image_src").notNull(),
});

export const userProgress = pgTable("user_progress", {
	userId: text("user_id").primaryKey().notNull(),
	userName: text("user_name").default('user').notNull(),
	userImageSrc: text("user_image_src").default('/mascot.png').notNull(),
	activeCourseId: integer("active_course_id"),
	hearts: integer().default(5).notNull(),
	points: integer().default(0).notNull(),
	streakCount: integer("streak_count").default(0).notNull(),
	lastLoginDate: timestamp("last_login_date", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activeCourseId],
			foreignColumns: [courses.id],
			name: "user_progress_active_course_id_courses_id_fk"
		}).onDelete("cascade"),
]);

export const units = pgTable("units", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	courseId: integer("course_id").notNull(),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "units_course_id_courses_id_fk"
		}).onDelete("cascade"),
]);

export const challengeProgress = pgTable("challenge_progress", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	challengeId: integer("challenge_id").notNull(),
	completed: boolean().default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.challengeId],
			foreignColumns: [challenges.id],
			name: "challenge_progress_challenge_id_challenges_id_fk"
		}).onDelete("cascade"),
]);

export const challengesOptions = pgTable("challenges_options", {
	id: serial().primaryKey().notNull(),
	challengeId: integer("challenge_id").notNull(),
	text: text().notNull(),
	correct: boolean().notNull(),
	imageSrc: text("image_src"),
	audioSrc: text("audio_src"),
}, (table) => [
	foreignKey({
			columns: [table.challengeId],
			foreignColumns: [challenges.id],
			name: "challenges_options_challenge_id_challenges_id_fk"
		}).onDelete("cascade"),
]);

export const challenges = pgTable("challenges", {
	id: serial().primaryKey().notNull(),
	lessonId: integer("lesson_id").notNull(),
	type: type().notNull(),
	question: text().notNull(),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.lessonId],
			foreignColumns: [lessons.id],
			name: "challenges_lesson_id_lessons_id_fk"
		}).onDelete("cascade"),
]);

export const lessons = pgTable("lessons", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	unitId: integer("unit_id").notNull(),
	order: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [units.id],
			name: "lessons_unit_id_units_id_fk"
		}).onDelete("cascade"),
]);

export const userSubscription = pgTable("user_subscription", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	stripeCustomerId: text("stripe_customer_id").notNull(),
	stripeSubscriptionId: text("stripe_subscription_id").notNull(),
	stripePriceId: text("stripe_price_id").notNull(),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { mode: 'string' }).notNull(),
}, (table) => [
	unique("user_subscription_user_id_unique").on(table.userId),
	unique("user_subscription_stripe_customer_id_unique").on(table.stripeCustomerId),
	unique("user_subscription_stripe_subscription_id_unique").on(table.stripeSubscriptionId),
]);

export const questProgress = pgTable("quest_progress", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	questId: integer("quest_id").notNull(),
	completed: boolean().default(false).notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
});
