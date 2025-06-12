CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"skill_level" varchar(50) NOT NULL,
	"location" varchar(100) NOT NULL,
	"game_types" text NOT NULL,
	"date" varchar(50),
	"tee_time" varchar(50),
	"number_of_players" integer DEFAULT 1,
	"details" text,
	"created_at" timestamp DEFAULT now(),
	"organizer_id" integer
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"skill_level" varchar(50) NOT NULL,
	"handicap" varchar(10),
	"preferred_course" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
