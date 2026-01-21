# CON-DFR Website Tasks

## Completed Tasks

### 1. Hero Carousel Button Fix
- [x] Modified CSS to move carousel indicators from `bottom: 4rem` to `bottom: 1.5rem`
- [x] Added responsive fix changing from `bottom: 3rem` to `bottom: 1rem`
- [x] Hidden scroll indicator when carousel is active
- [x] Committed changes to git
- [x] Pushed to GitHub (commit: 703be3c, ef086c9)
- [ ] Waiting for Railway deployment to complete

### 2. Partners Section Population
- [x] Scraped 23 partners from con-dfr.org (19 organizations + 4 individuals)
- [x] Created seed data endpoint in server-v3.js
- [x] Populated database with all partners including:
  - Hamnava Umbrella Group
  - Dana Research Society
  - Group 25 Shahrivar
  - Democratic Turkmens of Iran
  - Azerbaijan Democrat Party
  - Ahwaz Assembly
  - No to Execution Campaign
  - Bakhtiari Unity Party
  - Azerbaijan Democrat Fraction
  - Iranian Republicans Australia (YAR)
  - Woman Life Freedom Association Graz
  - Center for Democracy and Development of Azerbaijan
  - Iranian Republicans Convergence
  - Toronto Iranian Republicans Association (TIRA)
  - United for Iran Australia
  - Iranian Republicans of Southern Sweden
  - Rahe Farda Group
  - Iran Democratic Left Party
  - Mahsa Foundation
  - Hassan Shariatmadari (Individual)
  - Reza Moridi (Individual)
  - Alan Ekbatani (Individual)
  - Mehdi Ansari (Individual)
- [x] All partners displaying correctly on production site

### 3. Hero Images Section
- [x] 5 hero images exist in database
- [x] Hero carousel functioning on production
- [ ] Hero images need Persian/multilingual translations

### 4. Statements Section
- [x] 3 statements displaying on production:
  - Condemnation of Islamic Regime Crimes in Iran (14 Jan 2025)
  - Support for Immediate Formation of Strategic Council (12 Jan 2025)
  - To the Oppressed and Free People of Iran (31 Dec 2025)

## Pending Tasks

### CSS Deployment
- [ ] Verify Railway has deployed latest CSS fix
- [ ] Confirm hero indicators no longer collide with CTA buttons

### Content Enhancements (Optional)
- [ ] Add Persian translations to hero images
- [ ] Create local statement pages (currently linking to con-dfr.org)
- [ ] Populate Page Content section in admin

## Git Commits
1. `703be3c` - Fix hero carousel indicators collision with CTA buttons
2. `6b34f18` - Add populated database with partners and hero images
3. `5aa422e` - Add seed data endpoint for initial database population
4. `ef086c9` - Force CSS cache refresh - hero indicator fix

## Production URL
https://con-dfr-web-production.up.railway.app/