# Git Repository Setup Guide

## ✅ Current Status
- ✅ Git initialized
- ✅ Files added to staging
- ✅ Initial commit created

## 📋 Next Steps: Connect to Remote Repository

### Option 1: GitHub (Recommended)

#### Step 1: Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `angular-ecommerce` (or your preferred name)
4. Description: "Angular 17 e-commerce application with shopping cart and checkout"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

#### Step 2: Connect Local Repository to GitHub
After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/angular-ecommerce.git

# Verify remote was added
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

**If using SSH instead of HTTPS:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/angular-ecommerce.git
git push -u origin main
```

---

### Option 2: GitLab

#### Step 1: Create Repository on GitLab
1. Go to [GitLab.com](https://gitlab.com) and sign in
2. Click **"New project"** → **"Create blank project"**
3. Fill in project details
4. **DO NOT** initialize with README
5. Click **"Create project"**

#### Step 2: Connect and Push
```bash
git remote add origin https://gitlab.com/YOUR_USERNAME/angular-ecommerce.git
git branch -M main
git push -u origin main
```

---

### Option 3: Bitbucket

#### Step 1: Create Repository on Bitbucket
1. Go to [Bitbucket.org](https://bitbucket.org) and sign in
2. Click **"Create"** → **"Repository"**
3. Fill in details and create

#### Step 2: Connect and Push
```bash
git remote add origin https://bitbucket.org/YOUR_USERNAME/angular-ecommerce.git
git branch -M main
git push -u origin main
```

---

## 🔐 Authentication

### For HTTPS:
- **GitHub**: You'll need a Personal Access Token (not password)
  - Go to Settings → Developer settings → Personal access tokens → Generate new token
  - Select `repo` scope
  - Use token as password when prompted

- **GitLab/Bitbucket**: Use your account password or access token

### For SSH (Recommended):
1. Generate SSH key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Add SSH key to your account:
   - **GitHub**: Settings → SSH and GPG keys → New SSH key
   - **GitLab**: Preferences → SSH Keys
   - **Bitbucket**: Personal settings → SSH keys

3. Test connection:
   ```bash
   ssh -T git@github.com  # For GitHub
   ssh -T git@gitlab.com  # For GitLab
   ```

---

## 📝 Common Git Commands

### Check Status
```bash
git status
```

### View Remote Repositories
```bash
git remote -v
```

### Remove Remote (if needed)
```bash
git remote remove origin
```

### View Commit History
```bash
git log --oneline
```

### Push Future Changes
```bash
git add .
git commit -m "Your commit message"
git push
```

### Pull Latest Changes
```bash
git pull origin main
```

---

## 🚀 Quick Start Commands (Copy & Paste)

**Replace `YOUR_USERNAME` and `REPO_NAME` with your actual values:**

```bash
# Add remote (GitHub example)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify
git remote -v

# Push to remote
git branch -M main
git push -u origin main
```

---

## ⚠️ Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Error: "failed to push some refs"
```bash
# If remote has commits you don't have locally
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Error: Authentication failed
- Use Personal Access Token instead of password for GitHub
- Check SSH key is added to your account
- Verify repository URL is correct

---

## 📚 Additional Resources

- [GitHub Docs](https://docs.github.com/en/get-started)
- [GitLab Docs](https://docs.gitlab.com/)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
