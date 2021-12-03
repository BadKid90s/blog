@echo off

cd /d "%~dp0"

call yarn  build

cd dist

call git init
call git add -A
call git commit -m 'deploy'

call git push -f git@github.com:Post-90sBadKid/blog.git master:main
