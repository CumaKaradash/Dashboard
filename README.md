# BizFlow

## Kullanıcı Kılavuzu

- Sisteme giriş yaptıktan sonra sol menüden modüllere erişebilirsiniz.
- Ödeme, fatura, bütçe, hasta, ürün, seans ve vardiya işlemlerini kolayca yönetebilirsiniz.
- Yeni kayıt eklemek için ilgili modülde "Ekle" butonunu kullanın.
- Kayıtları silmek için listede çöp kutusu ikonuna tıklayın.
- Formlarda zorunlu alanları doldurun, hatalı girişlerde sistem sizi uyarır.
- Tüm sayfalar mobil ve masaüstü uyumludur.

## Geliştirici Kılavuzu

### Kurulum
1. Bağımlılıkları yükleyin:
   ```
   pnpm install
   ```
2. Geliştirme sunucusunu başlatın:
   ```
   pnpm run dev
   ```

### Build ve Deploy
- Build almak için:
  ```
  pnpm run build
  ```
- Netlify için publish directory: `.next`
- Çevre değişkenlerini Netlify panelinden tanımlayın (varsa).

### API Entegrasyonu
- Tüm veri işlemleri `/app/api` altında tanımlı endpointler üzerinden yapılır.
- Yeni modül eklemek için ilgili API route ve frontend fetch işlemlerini ekleyin.

### Test
- Tüm sayfaları ve formları localde ve canlıda test edin.
- Otomatik test altyapısı için Jest ve React Testing Library önerilir.

## UI/UX & Erişilebilirlik Checklist

- [ ] Tüm formlar ve butonlar klavye ile erişilebilir.
- [ ] Renk kontrastı ve okunabilirlik yüksek.
- [ ] Mobil ve masaüstü uyumluluk test edildi.
- [ ] Loading, hata ve başarı mesajları tutarlı.
- [ ] Tema/dark mode tüm sayfalarda çalışıyor.
- [ ] Formlarda validasyon ve hata mesajları var.
- [ ] Erişim kontrolleri ve yetkilendirme aktif.
