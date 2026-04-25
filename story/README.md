# Story Folder Mode

Scene hien tai CHI render anh trong folder `story/`.

## Them anh
1. Copy anh vao `story/`
2. Reload: `Ctrl + F5`

Scene se tu dong quet tat ca anh trong folder `story/` (jpg/jpeg/png/webp/avif), khong can sua code.

Neu server khong cho phep doc directory listing, ban co the tao file `story/manifest.json`:

```json
[
  "./story/ten-anh-1.jpg",
  "./story/ten-anh-2.png"
]
```

## Hanh vi scene
- Camera drift ngau nhien trai/phai/len/xuong trong khong gian anh.
- Anh ne camera cham va muot (khong giat).
- Cham chuot vao anh: anh bi day + xoay va co impact VFX nhe.
- Khi anh va vao vung slide active: tu dong nghieng/day giong cham chuot.
- Co toi uu mobile rieng de giu FPS.
