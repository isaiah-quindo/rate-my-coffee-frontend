// sanity.config.ts
import {defineConfig} from "sanity";
import {deskTool} from "sanity/desk";
import {schemaTypes} from "./studio/schemaTypes"; // adjust path to your schema

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",              // ⚠️ important — mount point
  plugins: [deskTool()],
  schema: { types: schemaTypes as any },
});
