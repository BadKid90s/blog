@echo off

cd /d "%~dp0"

::# 生成静态文件
yarn  build

::# 进入生成的文件夹
cd dist

::
git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Post-90sBadKid/blog.git master:main
