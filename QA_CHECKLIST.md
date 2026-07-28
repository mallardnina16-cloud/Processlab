QA Checklist — Nina - Her process

- [ ] Open app and verify logo displays (light/dark) in top bar and login screen
- [ ] Hover over cards: observe lift + deeper shadow
- [ ] Hover/press buttons: observe subtle translate and scale
- [ ] Navigate onboarding: steps display and progress dots animate
- [ ] Notifications: grant permission and confirm notification titles show the brand name
- [ ] LocalStorage keys: confirm `nina:herprocess:onboarding:{id}` and `nina:herprocess:reminders:{id}` are set
- [ ] Animated lists: observe staggered entrance on lists (dashboard, clients)
- [ ] Reduced motion: enable system reduced motion and confirm animations stop
- [ ] Login flow: sign in, check no regressions
- [ ] Client flows: open journal, add entry, verify realtime notification behavior
- [ ] Mobile/responsive: check bottom nav and buttons on narrow screens
- [ ] Performance: page load perceived speed improved by cache usage (visual)
- [ ] Service worker/push: verify registration in deployed secure context
