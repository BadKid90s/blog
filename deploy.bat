@echo off

cd /d "%~dp0"

::# 生成静态文件
call yarn  build

::# 进入生成的文件夹
cd dist

::
call git init
call git add -A
call git commit -m 'deploy'

call git push -f git@github.com:Post-90sBadKid/blog.git master:main
