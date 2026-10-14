# Güvenlik

- API anahtarı gerektirmez. `.env`, `out/` ve `public/media/` Git dışında tutulur.
- Komut satırından gelen prompt veri olarak işlenir; kabuk komutu olarak yürütülmez.
- Medya yolları `public/media` altına sınırlandırılarak doğrulanır.
- FFmpeg işlemlerinde güvenilmeyen dosyalar risk taşıyabilir. Güncel FFmpeg kullanın.
- CI yalnızca statik ve birim testleri çalıştırır; video render testi değildir.
- Güvenlik açığını herkese açık issue yerine GitHub Security Advisory üzerinden iletin.
