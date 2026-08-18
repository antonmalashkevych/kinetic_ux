# Publishing this repo to GitHub

This folder is a complete git repository (full commit history included).
To put it in `github.com/antonmalashkevych/kinetic_ux`:

## If the GitHub repo is empty (recommended)

```bash
cd kinetic_ux
git remote add origin https://github.com/antonmalashkevych/kinetic_ux.git
git push -u origin main
```

## If the GitHub repo already has commits you don't need

```bash
cd kinetic_ux
git remote add origin https://github.com/antonmalashkevych/kinetic_ux.git
git push -u origin main --force
```

## If you unzipped without the .git folder

Some unzip tools skip hidden folders. Check with `ls -a` - you should see
`.git`. If it's missing, re-extract with:

```bash
unzip kinetic_ux.zip -d .
```

## Authentication

If git prompts for a password, use a personal access token instead of your
account password: GitHub → Settings → Developer settings → Personal access
tokens → Fine-grained tokens → repository access limited to `kinetic_ux`,
permission Contents: Read and write. Use the token as the password, or run
`gh auth login` if you have the GitHub CLI.

## After pushing

- Set the default branch to `main` (Settings → Branches) if needed.
- Optional: enable GitHub Pages via an Actions workflow running
  `npm ci && npm run build` and publishing `dist/` if you want a hosted demo.
