# apecek.makeup — strona wizytówka

Statyczna strona (HTML + CSS + vanilla JS, bez build stepu) dla
**Aleksandry Pęcek** — makijaż ślubny, okolicznościowy i sesyjny, Kraków.
Źródło treści i zdjęć: [instagram.com/apecek.makeup](https://www.instagram.com/apecek.makeup/).

## Struktura

```
apecek-makeup/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/            hero-blur.jpg (tło hero) + profile.jpg + p01–p11.jpg
└── README.md
```

## Uruchomienie

Wystarczy otworzyć `index.html` w przeglądarce. Lokalny serwer:

```bash
python3 -m http.server 4321 --directory /Users/szymon.smykala/Documents/Claude/apecek-makeup
```

## Sekcje

Hero · O mnie · Usługi · Portfolio (filtry + lightbox) · Cennik · Opinie · FAQ · Kontakt

## Kolorystyka

Kolor wiodący — róż. Zmienne w `:root` w `assets/css/style.css`:

| zmienna | wartość | zastosowanie |
|---|---|---|
| `--pink-500` | `#E8437F` | kolor główny, przyciski, akcenty |
| `--pink-400` | `#FF7DAC` | gradienty |
| `--pink-600` / `--pink-700` | `#C92C66` / `#9C1F4C` | hover, ciemniejsze tła |
| `--pink-50` / `--pink-100` | `#FFF6F9` / `#FFE9F1` | tła sekcji, chipy |
| `--ink` | `#2C1B23` | tekst, stopka |

Zmiana odcienia = podmiana tych zmiennych, reszta strony dostosuje się sama.

## Do uzupełnienia przed publikacją

1. **Opinie** (`index.html`, sekcja `#opinie`) — trzy karty to szablony z widocznym
   tekstem zastępczym. Wklej prawdziwe cytaty z wyróżnionej relacji „Opinie klientek”
   na Instagramie. Nie zostawiaj zmyślonych opinii.
2. **Cennik** (`#cennik`) — kwoty (200 zł / 450 zł) są przykładowe. Podmień na realne
   stawki albo usuń liczby i zostaw „wycena indywidualna”.
3. **Formularz** (`assets/js/main.js`) — ustaw `MAIL_TO` na swój adres e-mail.
   Aby zapytania wysyłały się bez otwierania poczty, załóż formularz w Formspree
   (lub Netlify Forms) i wpisz adres do stałej `ENDPOINT`.
4. **Treści „O mnie” i FAQ** — napisane na podstawie opisu profilu; warto przeczytać
   i poprawić na własne słowa (np. lata doświadczenia, ukończone szkolenia).
5. **Zdjęcia** — pobrane z Instagrama w rozdzielczości 640 px (tyle serwuje IG w siatce).
   Do wersji produkcyjnej podmień na oryginały z sesji, najlepiej w formacie WebP.

## Tło hero

`assets/img/hero-blur.jpg` to rozmyte zdjęcie klientki (źródło: `IMG_8480.heic`).
Rozmycie jest **wypalone w pliku**, nie robione w CSS — dzięki temu ładuje się szybko
(128 KB przy 1600×2133) i wygląda tak samo w każdej przeglądarce.

Regenerowanie po podmianie zdjęcia (wymaga ImageMagick):

```bash
sips -s format jpeg wejscie.heic --out /tmp/src.jpg
magick /tmp/src.jpg -resize 1600x -blur 0x16 -modulate 102,112 -quality 84 assets/img/hero-blur.jpg
```

`-blur 0x16` steruje siłą rozmycia — im większa liczba, tym mocniej (0x38 to bardzo
mocne rozmycie, 0x8 ledwo zauważalne). `-modulate 102,112` lekko podbija jasność i nasycenie.
Kadrowanie tła ustawia `.hero__bg img { object-position }` w `style.css`, a różową
poświatę nad zdjęciem — `.hero__veil`.

## Prawa do zdjęć

Zdjęcia pochodzą z profilu i przedstawiają prace Aleksandry — przed publikacją warto
upewnić się, że fotografowie sesyjni zgadzają się na ich użycie na stronie
(i ewentualnie dodać podpisy z ich nazwiskami przy pracach z sesji).

## Hosting

Strona jest live na GitHub Pages: **https://szymonsmykala.github.io/apecek-makeup/**

Repo: `SzymonSmykala/apecek-makeup` (publiczne), Pages serwuje gałąź `main` z katalogu `/`.
Plik `.nojekyll` wyłącza przetwarzanie przez Jekyll — pliki idą na serwer bez zmian.

Każdy push do `main` publikuje się automatycznie (budowanie trwa kilkadziesiąt sekund).
Kolejne zmiany rób na osobnym branchu i przez PR do `main`, tak jak w pozostałych repo.

Wszystkie ścieżki w `index.html` są względne, więc strona działa też w podkatalogu
albo po przeniesieniu na inny hosting (Netlify, Vercel, FTP). Absolutne są tylko adresy
w metatagach Open Graph — przy zmianie domeny trzeba je podmienić.
