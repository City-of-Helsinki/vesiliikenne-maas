#!/usr/bin/env bash
cd "$(dirname "$0")/../"

GIT_STATUS="$(git status --porcelain; git log --oneline @{u}..)"
if [ -n "${GIT_STATUS}" ] ; then
    echo "${GIT_STATUS}"
    exit 1
fi
