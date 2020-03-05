#!/usr/bin/env bash
dest='predist/'
pre='pre.html'
post='post.html'
for page in $(find ./src/Pages/ -type f -print)
do
  filename=$dest${page#./src/Pages/}
  folder=${filename%/*}
  mkdir -p $folder
  cat $pre > $filename
  cat $page >> $filename
  cat $post >> $filename
done
