# Gates: MEOWAX 2.0 final audit

OWNS: src/**, e2e/**, scripts/**, README.md, GATES.md, package.json, public/**

Scope: Complete the missing MEOWAX 2.0 cover and player interactions, repair the requested UI and accessibility defects, and verify the static application end to end.

- [x] G1: TypeScript strict check passes for the final source
  CHECK: node scripts/verify-stage4.mjs typecheck
  EXPECT: TYPECHECK_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=1799b6f40948703e5a3f43a28c87afdf56b1c321fa1d9b0a17cca81ef8e9ccd3; exit=0; EXPECT=matched; output-sha256=0d31cf08e125020004c508c562e62037cd1809c414d62a869bc1452c072c96f0; output-bytes=13; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G2: ESLint passes for the final source
  CHECK: node scripts/verify-stage4.mjs lint
  EXPECT: LINT_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=896006727f291fc588574bff9ec0ced2c1c94ee3ef3ca8446f14b61e24abf7e2; exit=0; EXPECT=matched; output-sha256=00f8027709ba969248ef1de221d355e95291fe77a63021b526a7db106e9f1f09; output-bytes=8; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G3: unit tests pass for cover normalization, settings, recommendations, and image validation
  CHECK: node scripts/verify-stage4.mjs unit
  EXPECT: UNIT_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=bd108c7586d9a58d4798ddaca6e43e8fece21b5b59479c9b2bd8a61f42086d41; exit=0; EXPECT=matched; output-sha256=1b0b219a29d76ee457e4e7404c4ab9059d820a0123c54964fed3b2a93276b238; output-bytes=284; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G4: production build completes and reports bundle sizes
  CHECK: node scripts/verify-stage4.mjs build
  EXPECT: BUILD_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=23fb9ded374f4a886d3a692557e68053ad204a99caf7c02a23ece52896a14c67; exit=0; EXPECT=matched; output-sha256=ba1588569007e78f19c48839c4c88ef902b119c875fcdb978e938a6ed3f08a8b; output-bytes=1319; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G5: home section order and primary navigation pass browser checks
  CHECK: node scripts/verify-stage4.mjs structure
  EXPECT: STRUCTURE_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=57848b0c1a040b53d177b200b9ce89a2844e056e98388b42a900a0d4eb070910; exit=0; EXPECT=matched; output-sha256=51f85bfbbee0ee86c0f94ee0c202fdf25a216938f2e63daa7b8afd1f43842a39; output-bytes=584; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G6: cover editing, export parity, persistence, and legacy records pass browser checks
  CHECK: node scripts/verify-stage4.mjs cover
  EXPECT: COVER_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=e52264c68954c2037253b800683987ef4de17c17c0b7a092bb39072b2ee14f2e; exit=0; EXPECT=matched; output-sha256=5347bd0678efa8a4559c2b73d94997a0ed39a138ee85c2cc6bd370ce32b9c597; output-bytes=598; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G7: player controls, pointer handling, noise, and cleanup pass browser checks
  CHECK: node scripts/verify-stage4.mjs player
  EXPECT: PLAYER_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=d9ea3a4fadb19c751b40962f3db647880c01d506243afb5db77e131a5105ef76; exit=0; EXPECT=matched; output-sha256=d04a19811b02df38ead1b7c7fc3e0ff4c1657a8a35dd9ecd33a7a7c477495310; output-bytes=589; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G8: keyboard, focus, labels, and reduced motion pass browser checks
  CHECK: node scripts/verify-stage4.mjs a11y
  EXPECT: A11Y_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=ed323e764b7d87528907135eea1d4f800931b0e78fe53dfec04ac99abdb244f2; exit=0; EXPECT=matched; output-sha256=106bffeb58f74ce19e4c40ad63d3a68c9341bbd1e0274499bb5f9bbe0bdbf41d; output-bytes=586; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G9: all existing and new browser regression tests pass
  CHECK: node scripts/verify-stage4.mjs e2e
  EXPECT: E2E_OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=01fb4c5e722a62c76e977423b1432ca08ba8f65947c398216cd23c1bcd635bda; exit=0; EXPECT=matched; output-sha256=bb6a1b22c2dfee2d296b2809bc0111aa8acc36f2f3c7bf5f7235d23fdaf2c548; output-bytes=3002; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\fujitsu\Desktop\AI\0_Кейсы; path=cc6c6f3bd0a7/24 entries

- [x] G10: six target widths and all routes have been visually inspected with no critical layout defect
  EVIDENCE: 2026-11-14 Edge captured 36 viewport screenshots (320, 375, 390, 768, 1024, 1440 px across home, collection, detail, about, settings, 404); inspected six-by-six contact sheet and full-size 320 home/collection, 390 detail, 1440 settings; all 36 document widths fit viewport; fixed 320 collection sort control and rechecked screenshot.

- [x] G11: real AI cat detection still runs without a production mock
  EVIDENCE: 2026-11-14 AI_SMOKE=1 Playwright desktop ran with network access; 1 passed in 51.0s on public/samples/ginger.jpg; result rendered without demo badge; breed remained unknown.

- [x] G12: README accurately describes editing, audio noise, limits, tests, and deployment
  EVIDENCE: 2026-11-14 reviewed README sections for cover controls and safe framing, Tone.js effects, local AI and IndexedDB, install/build/test commands, and SPA deployment.
