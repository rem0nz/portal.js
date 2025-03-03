## Steps to use scripts
### Deploy Single dataset with github actions
The github actions below will automatically build and deploy a single dataset to gh-pages branch. Folow the steps below to achieve this:

**Step 1:** In the dataset repository you want to deploy, create a github secret with the name `PORTAL_REPO_NAME` and the value should be the name of the repository. 

See steps on creating a secret [here](https://docs.github.com/en/actions/reference/encrypted-secrets)

<img src="./assets/secrets.png" />

**Step 2:** Clone/Pull the dataset repository you want deploy:

```bash
git clone https://github.com/datasets/finance-vix
```
**Step 3:** Create a `.github/workflow` directory and add a `main.yml` file with the following content:

```bash
name: github pages

on:
  push:
    branches:
      - master
      - main

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node
      uses: actions/setup-node@v2.1.2
      with:
        node-version: '12.x'

    - name: Build datasets
      env:
        PORTAL_REPO_NAME: ${{ secrets.PORTAL_REPO_NAME }}
      run: |
        curl https://raw.githubusercontent.com/datopian/portal.js/main/scripts/single-dataset-no-commit.sh > portal.sh 
        git config --local user.email "$(git log --format='%ae' HEAD^!)"
        git config --local user.name "$(git log --format='%an' HEAD^!)"
        source ./portal.sh

```
You can see/download the action file [here]("./actions/single-dataset-ssg.yml")

**Step 3:** Commit and push your code:
```bash
git add .
git commit -m "Build dataset page"
git push 
```

**Step 4:**
Wait for a while as your page builds, and once you see the green check mark, navigate to your repository's github `pages` in settings, set the `source` to `gh-pages` and folder to `/root`:
<img src='./assets/sdnocommit.png' />

**Step 5:**
Open your deployed site at `https://<your github username>/github.io/<dataset repo name>/index.html`

______

## Other build options
### Deploy single dataset with no portal commit
This script creates and commit only the build files from nextjs to the gh-pages branch. 

**Step 1:** Clone/Pull the dataset repository you want deploy. For example:

```bash
git clone https://github.com/datasets/finance-vix
cd finance-vix
```
**Step 2:** In a terminal, export an env variable with the name of your dataset github repo.
For example if deploying https://github.com/datasets/finance-vix, then export the name as:
```bash
export PORTAL_REPO_NAME=finance-vix
```

**Step 3:** In the dataset repository's root folder, create a file called `portal.sh` and paste the following content:
```bash
#!/bin/bash
git checkout -b gh-pages
git rm -r --cached . 
rm -rf portal
mkdir -p portal
npx create-next-app portal -e https://github.com/datopian/portal.js/tree/main/examples/dataset-frictionless 
mkdir portal/public/dataset

cp -a ./data portal/public/dataset
cp -a ./datapackage.json portal/public/dataset
cp -a ./README.md portal/public/dataset

PORTAL_DATASET_PATH=$PWD"/portal/public/dataset"
export PORTAL_DATASET_PATH

cd portal
assetPrefix='"/'$PORTAL_REPO_NAME'/"'
basePath='"/'$PORTAL_REPO_NAME'"'
echo 'module.exports = {assetPrefix:' ${assetPrefix}', basePath: '${basePath}' }' > next.config.js ## This ensures css and public folder works
yarn export

cd ..
cp -R -a portal/out/* ./
touch .nojekyll
git add $PWD'/_next' $PWD'/index.html' $PWD'/dataset' $PWD'/404.html' $PWD'/.nojekyll' $PWD'/favicon.ico'
git commit -m "Build new dataset page"
git push origin gh-pages
```
**Step 4:** Run the bash script in a terminal with:
```bash
source portal.sh
```
> Note: Use `source` instead of `bash` so that the script can work well with environment variables. 

**Step 5:**
Go to your repository's github `pages` in setting and set the Branch to gh-pages and folder to root:
<img src='./assets/sdnocommit.png' />

**Step 5:**
Open your deployed site at `https://<your github username>/github.io/<dataset repo name>`

____

### Deploy single dataset with portal commit
This script creates and commit the portal code and also adds an automated script to deploy to gh-page. Follow the steps below to use this script. 

**Step 1:** Create a Github Personal Access Token (PAT). See steps [here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

**Step 2:** In the dataset repository you want to deploy, create a github secret with the name `PORTAL_NEXT_TOKEN`. The value should be the PAT created in step 1. See steps on creating a secret [here](https://docs.github.com/en/actions/reference/encrypted-secrets)

> Note: Without the PAT and the secret configured, the automatic build will fail. 

**Step 3:** Clone/Pull the dataset repository you want deploy. For example:

```bash
git clone https://github.com/datasets/finance-vix
cd finance-vix
```

**Step 4:** In your computer's terminal/command prompt, export an environment variable with the name of your dataset's github repo.

For example if you want to deploy the dataset at https://github.com/datasets/finance-vix, then export the name using the command:
```bash
export PORTAL_REPO_NAME=finance-vix
```

**Step 5:** Create a file called `portal.sh` and paste the following content:
```bash
#!/bin/bash
rm -rf portal
mkdir -p portal
npx create-next-app portal -e https://github.com/datopian/portal.js/tree/main/examples/dataset-frictionless 
mkdir portal/public/dataset

cp -a ./data portal/public/dataset
cp -a ./datapackage.json portal/public/dataset
cp -a ./README.md portal/public/dataset

PORTAL_DATASET_PATH=$PWD"/portal/public/dataset"
export PORTAL_DATASET_PATH

mkdir -p .github && mkdir -p .github/workflows && touch .github/workflows/main.yml
curl https://raw.githubusercontent.com/datopian/portal.js/main/scripts/gh-page-builder-action.yml > .github/workflows/main.yml

cd portal
assetPrefix='"/'$PORTAL_REPO_NAME'/"'
basePath='"/'$PORTAL_REPO_NAME'"'
echo 'module.exports = {assetPrefix:' ${assetPrefix}', basePath: '${basePath}' }' > next.config.js ## This ensures css and public folder works

cd ..
git add .
git commit -m "Add dataset build feature"
git push 

```
**Step 6:** Run the bash script with:
```bash
source portal.sh
```
> Note: Use `source` instead of `bash` so that the script can work well with environment variables. 

**Step 7:**
Go to your repository's github `pages` in setting and set the Branch to gh-pages and folder to root:
<img src='./assets/sdnocommit.png' />

**Step 8:**
Open your deployed site at `https://<your github username>/github.io/<dataset repo name>`

____