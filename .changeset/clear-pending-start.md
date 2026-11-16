---
'@bprogress/react': patch
'@bprogress/vue': patch
---

fix: clear a pending delayed start when `start()` is called again, so `stop()` can't be followed by a stale start
