# Özgün örnek prompt'lar

```bash
npm run video -- --prompt "30 saniyelik Instagram videosu: Güçlü parola kullan; İki aşamalı doğrulamayı aç; Yazılımlarını güncelle"
```

```bash
npm run make -- --prompt "1 dakikalık YouTube videosu: Güneş panelleri ışığı toplar; İnverter elektriği dönüştürür; Enerji evde kullanılır" --title "Güneş enerjisi"
npm run render -- --platform youtube
```

```bash
npm run clips -- --input public/media/long.mp4 --transcript examples/transcript.json --count 3 --format portrait
```

Bu prompt'lar deterministik sahne taslakları oluşturur. Seslendirme/görüntü üretimi için kendinize ait veya ayrıca lisanslanmış medya gerekir.
