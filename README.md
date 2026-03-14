# Country Similarity Survey App

This is a Vue.js 3 + Vite application for conducting a Country Similarity Survey. It uses Firebase for backend services (Firestore) and is designed to be deployed on GitHub Pages.

## Project Setup

### 1. Prerequisites
- Node.js installed (v16+)
- A Google/Firebase account

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. **Firestore Database:**
   - Navigate to "Firestore Database" in the sidebar.
   - Click "Create database".
   - Start in **Production mode**.
   - Choose a location.
   - Go to the "Rules" tab and copy the content from `firestore.rules` in this project.
4. **Authentication (Optional but recommended for IP limits):**
   - You can enable Anonymous Auth if you want to track users better, but this app currently uses UUID + IP check.
5. **Register Web App:**
   - In Project Overview, click the Web icon (</>).
   - Register app (e.g., "survey-app").
   - **Copy the `firebaseConfig` object.**

### 3. Configure Application
1. Open `src/firebaseConfig.js`.
2. Replace the placeholder `firebaseConfig` object with the one you copied from Firebase Console.

### 4. Install Dependencies
```bash
npm install
```

### 5. Development
```bash
npm run dev
```

## Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### 1. Prepare the Repository
You need to push the contents of the `survey_app` folder to a new GitHub repository.

**Which files to push?**
- Push everything in this folder **EXCEPT** `node_modules`, `dist`, and `.firebase` (these are automatically ignored by the `.gitignore` file).

**Step-by-step Command Line Instructions:**

1. Open your terminal and navigate to the `survey_app` directory:
   ```bash
   cd survey_app
   ```

2. Initialize a new Git repository:
   ```bash
   git init
   ```

3. Add all files to the staging area:
   ```bash
   git add .
   ```

4. Commit the changes:
   ```bash
   git commit -m "Initial commit"
   ```

5. Create a new repository on GitHub (do not initialize with README/gitignore).

6. Link your local repository to GitHub (replace URL with your repo URL):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### 2. Configure GitHub Secrets (Important for Firebase)
Since we are using environment variables to hide your Firebase config, you need to add them to GitHub Secrets so the build process can access them.

1. Go to your repository's **Settings** tab.
2. In the left sidebar, click **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Add the following secrets (copy values from your local `.env` file):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### 3. Configure GitHub Pages
1. Go to your repository's **Settings** tab on GitHub.
2. Click on **Pages** in the left sidebar.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
   *(Note: Since we added `.github/workflows/deploy.yml`, GitHub might detect this automatically, but it's good to verify).*

### 4. SPA Route Refresh Support
This project uses path-based language URLs (`/zh` and `/en`). GitHub Pages serves static files, so refreshing a deep link would normally return 404.

To solve this, the project includes:
- `public/404.html`: redirects unknown paths to `index.html` while preserving route info.
- `index.html`: restores the original path before Vue initializes.

If you rename the repository or switch to a user/organization page, check the `segmentCount` value in `public/404.html`:
- project page (`https://username.github.io/repo/`): keep `segmentCount = 1`
- user/org page (`https://username.github.io/`): use `segmentCount = 0`

### 5. Verify Deployment
1. Click on the **Actions** tab in your repository to see the deployment progress.
2. Once the workflow shows a green checkmark, your site is live.
3. The URL will usually be `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`.

### Note on `vite.config.js`
Ensure your `vite.config.js` has the correct `base` setting.
- For this repository (`https://inewhero.github.io/Combiasation/`), use `'/Combiasation/'`.
- If you rename the repository to a different path, update `base` accordingly (e.g., `'/new-repo-name/'`).
- If you are deploying to a custom domain or user page, adjust accordingly.

## Admin & Data
- View submissions in the Firebase Console under **Firestore Database** -> `surveyResponses`.
- You can export data from Firebase Console to JSON/CSV for analysis.

## Security
- The security rules in `firestore.rules` ensure that public users can ONLY submit data and cannot read other people's submissions.
