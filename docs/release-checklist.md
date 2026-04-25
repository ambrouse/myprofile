# Release Checklist

## Visual QA
- [ ] Tong the dung dark tech AI visual language.
- [ ] Typography hierarchy ro rang tren desktop va mobile.
- [ ] Button/card/nav/counter dong bo state + focus.

## Motion QA
- [ ] Slide transition muot, khong gap frame drop ro rang.
- [ ] Camera 3D phan hoi ngay voi pointer.
- [ ] `prefers-reduced-motion` fallback hoat dong.

## i18n QA
- [ ] `vi` la ngon ngu mac dinh.
- [ ] Chuyen `vi/en` khong vo layout.
- [ ] `node scripts/check-i18n.js` pass.

## Performance QA
- [ ] Quality `auto` tu dieu chinh duoc.
- [ ] Khong co long task > 50ms trong interaction thong thuong.
- [ ] Test toi thieu tren Chrome/Edge/Firefox.

## Final
- [ ] README cap nhat.
- [ ] PLAN va docs baseline dong bo trang thai.
