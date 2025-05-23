# GitHub Deployment Instructions for Roomaity Platform

This document provides step-by-step instructions for deploying the Roomaity platform to GitHub Pages.

## Prerequisites
- GitHub account (username: roomi8y)
- Git installed on your local machine

## Step 1: Create a New GitHub Repository

1. Log in to your GitHub account (roomi8y)
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Enter repository name: `roomaity`
4. Add a description: "Roommate finding platform for Saudi Arabia"
5. Choose "Public" visibility
6. Do NOT initialize with README, .gitignore, or license
7. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, you'll see instructions for pushing existing code. Follow these commands:

```bash
# Navigate to your project directory
cd /home/ubuntu/roommate-platform/github-deploy

# Add the GitHub repository as a remote
git remote add origin https://github.com/roomi8y/roomaity.git

# Push your code to GitHub
git push -u origin main
```

You'll be prompted to enter your GitHub username and password or personal access token.

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub (https://github.com/roomi8y/roomaity)
2. Click on "Settings" tab
3. Scroll down to "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for GitHub Pages to deploy your site

## Step 4: Access Your Deployed Website

After GitHub Pages has finished deploying, your website will be available at:
https://roomi8y.github.io/roomaity/

## Additional Notes

- Any changes you make to your code will need to be committed and pushed to GitHub to update the live site
- To update your site, use these commands:
  ```bash
  git add .
  git commit -m "Description of changes"
  git push origin main
  ```
- You can set up a custom domain in the GitHub Pages settings if desired
