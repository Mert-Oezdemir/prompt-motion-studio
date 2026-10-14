# Prompt Motion Studio

**Türkçe, yerelde çalışan prompt → sahneler → Remotion MP4 başlangıç projesi.**

> Bu depo resmi bir Remotion projesi değildir. Özgün uygulama kodu MIT lisanslıdır; **Remotion, MIT lisanslı değildir ve OSI açık kaynak tanımını karşılamayan ayrı source-available koşullara tabidir.** Kullanım hakkınızı [Remotion lisans belgelerinden](https://www.remotion.dev/docs/license) doğrulayın.

Bu başlangıç projesi prompt metnini deterministik olarak sahnelere ayırır ve Remotion ile video hazırlamayı kolaylaştırır. **Bir LLM servisi, otomatik seslendirme, otomatik konuşma tanıma veya özgün görüntü üretimi içermez.** Bu özellikler için ek araçlar ve kullanım hakları gerekir. Video sayısı donanım, render süresi ve geçerli lisanslarla sınırlıdır.

## Özellikler

- 1080 × 1920 Instagram ve 1920 × 1080 YouTube kompozisyonları
- Süre, başlık ve sahne metniyle düzenlenebilir `project.json`
- React/Remotion animasyonu, sahne bazlı yazılar ve isteğe bağlı yerel görsel/video/ses
- MP4 render komutu
- Zaman kodlu transkriptten sezgisel kısa klip seçimi ve FFmpeg ile SRT gömme
- Test, GitHub Actions, örnekler, kod ajanı skill talimatı

## Kurulum

Node.js 20+, npm kurun. Klip modülü ayrıca FFmpeg ve `subtitles` filtre desteği ister.

```bash
git clone https://github.com/Mert-Oezdemir/prompt-motion-studio.git
cd prompt-motion-studio
npm install
npm run check
npm run studio
```

## Prompt → MP4

```bash
npm run video -- --prompt "30 saniyelik Instagram videosu: Fikrini belirle; Sahneleri planla; Videonu paylaş"
```

Bu komut `project.json` dosyasını **yeniden yazar** ve render yapmayı dener. Aşamalı kullanım:

```bash
npm run make -- --prompt "45 saniyelik Instagram videosu: Bir fikir; İkinci fikir; Sonuç"
npm run studio
npm run render -- --platform instagram --output out/ilk-video.mp4
npm run render -- --platform youtube --output out/yatay-video.mp4
```

Her sahne `id`, `title`, `body`, `durationSeconds`, isteğe bağlı `caption`, `accent`, `media`, `audio` alanlarıyla düzenlenebilir. Sahne yazısı konuşmadan otomatik çıkarılan gerçek altyazı değildir. Yerel medya dosyalarını `public/media/` içine koyun. Örnek: `"media": "media/benim-videom.mp4"` veya `"audio": "media/ses.mp3"`. Bu dosyaları yayınlama haklarına sahip olduğunuzdan emin olun.

## Uzun videodan kısa klip

Kaynak videonuzu `public/media/long.mp4` olarak koyup kendi videonuza ait saniye zaman kodlu JSON transkript sağlayın:

```bash
npm run clips -- --input public/media/long.mp4 --transcript examples/transcript.json --count 3 --format portrait
```

Çıktı `out/clips/` dizinindedir. Klip seçimi **sezgiseldir**, video-anlama veya otomatik transkripsiyon değildir. `--no-burn` ile SRT yazısını videoya gömmeden dışa aktarabilirsiniz. FFmpeg merkezden kırpar, yüz takibi yapmaz.

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run studio` | Canlı Remotion önizleme |
| `npm run make -- --prompt "..."` | Sahne taslağı oluştur |
| `npm run video -- --prompt "..."` | Sahne oluştur ve render dene |
| `npm run render -- --platform youtube` | 16:9 MP4 |
| `npm run render -- --platform instagram` | 9:16 MP4 |
| `npm run clips -- --input ... --transcript ...` | Sezgisel kısa klipler |
| `npm run check` | Validasyon, tip kontrolü ve test |

## Lisans

Bu deponun yalnızca **özgün kodu ve metinleri MIT lisanslıdır**. Remotion, React, FFmpeg, codec, görsel ve ses hakları ayrıca geçerlidir. Remotion'un kaynak kodu, ücretli medya veya başka bir yazardan alınan rehber bu depoya kopyalanmamıştır. Ayrıntılar: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [LICENSE](LICENSE), [SKILL.md](skills/remotion-video/SKILL.md).
