#!/usr/bin/env bash
dest='predist/'
pre='pre.html'
post='post.html'
for page in src/Pages/* 
do 
  if [ -f $page ]
  then
    filename=$dest${page##*/}
    cat $pre > $filename
    cat $page >> $filename
    cat $post >> $filename
  fi
done
mkdir -p predist/Blog
dest='predist/Blog/'
for page in src/Pages/Blog/* 
do 
  if [ -f $page ]
  then
    filename=$dest${page##*/}
    cat $pre > $filename
    cat $page >> $filename
    cat $post >> $filename
  fi
done
