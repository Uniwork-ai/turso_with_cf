import "./resolvers/index";
import { builder } from "./builder";
import { lexicographicSortSchema, printSchema } from "graphql";
import { writeFileSync } from "fs";
builder.queryType({});
builder.mutationType({});
builder.queryField("ping", (t) =>
  t.string({
    resolve: () => `pong`,
  })
);

export const schema = builder.toSchema();
// To generate schema.graphql file uncomment the following code
/* 
const schemaAsString = printSchema(lexicographicSortSchema(schema));
writeFileSync("./src/generated/schema.graphql", schemaAsString);
*/
