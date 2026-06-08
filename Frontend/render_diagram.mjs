import { run } from "@mermaid-js/mermaid-cli";
import { readFileSync } from "fs";

await run(
  "klassendiagramm.mmd",
  "klassendiagramm.png",
  { backgroundColor: "white", width: 1400, quiet: true }
);
console.log("done");
