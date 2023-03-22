@echo off
cd /d "%~dp0"
call yarn  build
cd dist
call git init
call git add -A
call git commit -m 'deploy'
call git push -f https://github.com/BadKid90s/blog.git main:main
