#!/usr/bin/env bash
ok=bad
pythcmd=none
mycmd=none
for pyth in python python3.6 python3.5 python3 python2.7 python2.6 python2; do
  pypath=$(type -P $pyth)
  if [[ -x $pypath ]] ; then
    pythcmd=($pyth)
    ok=$(
      $pyth <<@@

import sys
if sys.version_info >= (3, 0):
  print ("ok")
else:
  print("bad")
@@

    )
    if [[ $ok == ok ]] ; then
      mycmd="$pythcmd -m http.server 3000"
      break
    fi
  fi
done

if [[ $ok != ok ]]; then
  echo "Could not find suitable python version"
  exit 2
fi

eval $mycmd
