// Salin file aplikasi web ke folder www/ untuk dibungkus Capacitor.
import { cpSync, rmSync, mkdirSync } from "node:fs";
rmSync("www", { recursive: true, force: true });
mkdirSync("www");
for (const f of ["index.html", "app.css", "app.js", "manifest.webmanifest", "icons"]) cpSync(f, `www/${f}`, { recursive: true });
console.log("www/ siap");
