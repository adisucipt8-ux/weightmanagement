// Penyesuaian proyek Android hasil `cap add android`.
import { readFileSync, writeFileSync } from "node:fs";
const manifest = "android/app/src/main/AndroidManifest.xml";
let m = readFileSync(manifest, "utf8");
if (!m.includes("android.permission.CAMERA")) {
  m = m.replace("</manifest>", '    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />\n</manifest>');
}
m = m.replace('android:screenOrientation="unspecified"', 'android:screenOrientation="portrait"');
writeFileSync(manifest, m);
// Nomor versi dari GitHub Actions (setiap build naik satu)
const gradle = "android/app/build.gradle";
let g = readFileSync(gradle, "utf8");
const code = parseInt(process.env.VERSION_CODE || "1", 10);
const name = process.env.VERSION_NAME || "1.0." + code;
g = g.replace(/versionCode \d+/, `versionCode ${code}`).replace(/versionName "[^"]*"/, `versionName "${name}"`);
writeFileSync(gradle, g);
console.log(`Android dipatch: versi ${name} (${code})`);
