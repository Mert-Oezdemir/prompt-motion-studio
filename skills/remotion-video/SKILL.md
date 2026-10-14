---
name: remotion-video
summary: Generate and render editable Remotion storyboards from user prompts
---

# Video agent yönergesi

Bu depoda çalışırken önce README, LICENSE, THIRD_PARTY_NOTICES ve project.json dosyalarını oku.

1. Kullanıcı isteğinden platformu, video süresini, ana mesajları ve sağlanan medyayı çıkar.
2. Instagram için 1080×1920 ve YouTube için 1920×1080 kompozisyonlarını kullan.
3. Taslak için `npm run make -- --prompt "KULLANICI PROMPTU"` çalıştır.
4. Sahne içeriğini project.json üzerinde iyileştir. Olmayan araştırma, istatistik veya alıntıyı gerçek gibi yazma.
5. Yalnızca hak sahibi olunan yerel `public/media` varlıklarına referans ver. Kimlikleri benzersiz tut.
6. `npm run check` ile kontrol et; mümkünse `npm run studio` ile önizle.
7. `npm run render -- --platform instagram` veya `--platform youtube` ile gerçek MP4 oluştur; dosyanın varlığını doğrulamadan başarılı olduğunu söyleme.
8. Kullanıcı uzun video verirse zaman kodlu transkript de iste. `npm run clips -- --input public/media/long.mp4 --transcript examples/transcript.json` çalıştır. Bu işlem otomatik transkripsiyon değildir.

**Dikkat:** Bu dosya kendiliğinden AI modeli, görüntü/ses üretimi veya Remotion ticari lisansı sağlamaz. Remotion kaynak kodunu MIT olarak yeniden lisanslama. Telifli veya izinsiz içerikleri ekleme. Tokenları ve özel medya dosyalarını GitHub'a gönderme.
