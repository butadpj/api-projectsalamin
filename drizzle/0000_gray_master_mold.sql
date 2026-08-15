CREATE TABLE "salamin_responses" (
	"submission_id" uuid PRIMARY KEY NOT NULL,
	"experiment_version" text NOT NULL,
	"affinity" text NOT NULL,
	"reactions" jsonb NOT NULL,
	"reflection" text NOT NULL,
	"duration_seconds" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "salamin_responses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "salamin_responses_created_at_idx" ON "salamin_responses" USING btree ("created_at");