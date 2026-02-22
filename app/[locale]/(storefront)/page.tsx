import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Grid3x3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/shared/lib/i18n";

type LocalizedText = {
  th: string;
  en: string;
};

type CollectionItem = {
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string;
};

type ProductItem = {
  title: LocalizedText;
  subtitle: LocalizedText;
  badge?: LocalizedText;
  price: LocalizedText;
  image: string;
};

const trendingCollections: CollectionItem[] = [
  {
    title: { th: "Royal Gold", en: "Royal Gold" },
    subtitle: { th: "ความสง่างามเหนือกาลเวลา", en: "Timeless elegance" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoEac8GbzbGoPmFCvLCJVSd6bnTBdoZyyNziPJUa3HiyZ2IyyvgNJxwRryGPjPxnbnIERrwSdMcF6Xmi8j8e_D4edPLUCQJWBp_I3z--QsIsZr8tJVPYmfWn5OEfqgXQeMFtsu3oWh_FDTcj87GgOSkNN8kXXDrMjxOwEZK4Hsn4W9kt2FsuEXso5QpKECfmL8VN5R8PB3lIrXaCT2UgJa9UKw3SvbwbA-S2c3OqtHxcrYtHGBZfGtcGEpkgHU0zqToLB2NdRZ5Q",
  },
  {
    title: { th: "Vintage Mudmee", en: "Vintage Mudmee" },
    subtitle: { th: "ลวดลายมรดกไทย", en: "Heritage patterns" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDK-AJYH2PG7mBv9q-U-l5aDXRs6WTVFkyejDsIMRUfdQ4lqkdHHqcGOpGUpaXvOoJQw43NNwoozILHQ4n6BdEKZqSpgrZ22215Bq7DLs4i22hvuCZmPsde1lc7pDo3zcAbnMgJZD19DsS5XYBNAWQtZohFAC8d8XeU5iib8682ZrbtqK3Fv_qGJLrPVkxOWfS57O8Grji6UlhNYgDS1LCfHnQevMP8r8SnNP3YdENgptzygir5DUMPIb4iOgvCqarhIwij8ERFQEg",
  },
  {
    title: { th: "Indigo Dyed", en: "Indigo Dyed" },
    subtitle: { th: "ย้อมครามธรรมชาติ", en: "Natural cool tones" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwm3GJOrGKz-OdkaY7VTOYkKvUZw9DZtkq62XHQ8YlbuOc_VAHXpwQS1exh9Wm71rfTSprxWOt1aJqFGUZEqMaNQcZu4nGzZsQwBpnAnb6hrTHiSccZOGm-QtspZiKQNE2lRlfOmbh3GcZ6GNAlxHcM9Oi_yp8VNqEDN77s3ebMLi_ZDoDr2pmmLzoThcJ7V8D3ATr20nfTy2qSrTTQfhAplcWh1W-VT8aBQ9hvLxzug9DqGzDGqt8Xl2rFzzs14Ih4vcCfFOyU0k",
  },
  {
    title: { th: "Modern Cuts", en: "Modern Cuts" },
    subtitle: { th: "ผ้าไหมสำหรับทุกวัน", en: "Silk for everyday" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7COMbDLh9JuRh4aLmrsVhT4k0dCVI1eII66VHzWzACZdQyklBohi7husYvjgrKqfFVOeWWUGtKF3y05HcOwyt9b-HfDWjUyD-jfqRAdpuf_E9FH1CE5XIhytADX15UrAaDxWcR_1uFcJgkWqjw-ETr2D_S5x9DDhV3E5t60VFyTxVKmEX3EZjxS9Adh-UXWz9ll6CxLh5ifI-s5WskSFkgMQfm4rQXt-HzKat8RKvFwI31bL7OYJsDUEA2a-sleJEW6FIsaf-0us",
  },
];

const arrivals: ProductItem[] = [
  {
    title: { th: "Golden Peacock Shawl", en: "Golden Peacock Shawl" },
    subtitle: { th: "มัดหมี่ทอมือ", en: "Hand-woven Mudmee" },
    badge: { th: "ใหม่", en: "New" },
    price: { th: "฿ 2,500", en: "฿ 2,500" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwcW1iHpojahnLwFtU18fL2DlurfvW1eN9Wh0sJ88BPRiG-CHbhHZFq04s1jckXEhRxh1iZbofURZJbmhVGvDEHXJROeJBMr0vtfwWofQ4yXntkWAMZegnYuyuvW-Neeo1Uw__fpqUvvMMw0KxwN7csGVrJWBRGv-RUcEo_10SebevMQuEBzo1lDI0e2Gqokb44zt_axg36IVT3MRfq5PtwEwfvLi3keZ-YNfvsMMlHop2RBsOBYjf1_vI9UHYMq8Qk-QCLHu48C8",
  },
  {
    title: { th: "Royal Purple Yardage", en: "Royal Purple Yardage" },
    subtitle: { th: "ผ้าไหมไทย 2 เส้น", en: "2-Ply Thai Silk" },
    price: { th: "฿ 950 / หลา", en: "฿ 950 / yard" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCyERc-92PdsIGV2VDgx-q0mmQyLUHj-rjb-TuQHMfoCS9dEgx1z119eDcCmRFuDznHnU1cPcQL0d3qQsNTL-5cBcBtC0saIeaYhiSr3UgCWmcXCX9zetXbK_gafhYWTlBKQgNqAl6zZfO38rjA_yTuKxK0HeMQvswMXvHm1CXhoXVg34OjMqyeN49GXFWegPzjbLNoZTpixt8wb6xN7yuKFwZOUL9dGcW3l0xHHAifS0fIw2e9wSMHItCT78wTl7a87O5lmN5Vqtw",
  },
  {
    title: { th: "Indigo Clouds Scarf", en: "Indigo Clouds Scarf" },
    subtitle: { th: "ย้อมสีธรรมชาติ", en: "Natural Dye" },
    badge: { th: "ขายดี", en: "Best Seller" },
    price: { th: "฿ 1,200", en: "฿ 1,200" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXadiZJqnQJrqeZXZc7hl8NcdSW_LTM7_fwMq6GbMjz-xAhJszcVp3CS6yqXM6S3JOoUIWJVf3VGGIx0mbtCHIUGII3JUFTzbNEhgu686xK8KR5GEW5e8F34PliBMpjzrAjtGt8VuWcCfXt7HToYT8Wbd6GW1BHYGP2IF1DMJSYxQh5GJU089Z4yMeypst7_CkJW6PwxJfOqfh1cW6pJueRzzqJqlAtWM9wWc1vy0G2vEzRMENcjPUBL-nCChsndUfJJvmwqM3sUU",
  },
  {
    title: { th: "Sunset Horizon Cushion", en: "Sunset Horizon Cushion" },
    subtitle: { th: "ของตกแต่งบ้าน", en: "Home Decor" },
    price: { th: "฿ 890", en: "฿ 890" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_99m6r-YdzLgCI5bb0-SRFUFv0WgmON51KmRkoeSyK7ba08Cc7u6cFyGx30tY89CCJpHbFbyjgJRbK3zYxaXvICGtDiFzxx3PG7a3am8LQq0YPxAvZlCI2QVT2nGduilD67QMBVxwdT2dA4vnT_vcaG9qW_N3OyYdFBDZer4Rt9W9-oEcr72kMDpdDKZK3gI_MQxDUU2rPyntBbq9kpZPuyffB0pwM-4-sd2Wc1oycUWPmDfuE-LwcFpAd6vK-zoCzqflmWMjcWg",
  },
];

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7COMbDLh9JuRh4aLmrsVhT4k0dCVI1eII66VHzWzACZdQyklBohi7husYvjgrKqfFVOeWWUGtKF3y05HcOwyt9b-HfDWjUyD-jfqRAdpuf_E9FH1CE5XIhytADX15UrAaDxWcR_1uFcJgkWqjw-ETr2D_S5x9DDhV3E5t60VFyTxVKmEX3EZjxS9Adh-UXWz9ll6CxLh5ifI-s5WskSFkgMQfm4rQXt-HzKat8RKvFwI31bL7OYJsDUEA2a-sleJEW6FIsaf-0us";

const storyImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6zqqZqwaDs5kNBJ2W8I_nHIkXd1Y3bGykJ1yXSghlp6pqugf17w-GBZczi29DZmLy7p0TIUaCsRlyS_2XcQuXlC0bd5ujcp3EAei385EeomAyY3vmQivx4JUFseRHjwcIS9ztt2oAXjCbvehvrh4cL_9M0nHxpFnuiaSd9YpJoo09xOtFVgcxGiRgBqUx75Y07cRk_ptHJ2QPV7fxz1LVOkSyUZQ7bA3VxzV7Ad7Flr2yvDAq3kmDFpkYGAGwks6Cl_lCjBaKkRM";

function t(locale: Locale, text: LocalizedText): string {
  return locale === "th" ? text.th : text.en;
}

export default async function StorefrontHomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const dict = {
    hero: {
      badge: locale === "th" ? "คอลเลกชันใหม่ 2024" : "New Collection 2024",
      title: locale === "th" ? "สัมผัสนุ่มละมุน กลิ่นอายร่วมสมัย" : "Soft Touch, Modern Soul",
      description:
        locale === "th"
          ? "ค้นพบความสง่างามของผ้าไหมไทยในมุมมองใหม่ สำหรับไลฟ์สไตล์ยุคปัจจุบัน"
          : "Discover the gentle elegance of contemporary Thai silk for modern lifestyle.",
      shopLatest: locale === "th" ? "เลือกซื้อคอลเลกชันล่าสุด" : "Shop Latest",
      viewLookbook: locale === "th" ? "ดูลุคบุ๊ก" : "View Lookbook",
    },
    categories: {
      all: locale === "th" ? "ทั้งหมด" : "All",
      list:
        locale === "th"
          ? ["มัดหมี่", "แพรวา", "ครามธรรมชาติ", "ผ้ายก", "แอ็กเซสซอรี"]
          : ["Mudmee Silk", "Praewa Silk", "Natural Indigo", "Brocade", "Accessories"],
    },
    trending: {
      title: locale === "th" ? "คอลเลกชันยอดนิยม" : "Trending Collections",
      description:
        locale === "th"
          ? "คัดสรรพิเศษสำหรับฤดูกาลนี้"
          : "Curated selection for the season.",
      viewAll: locale === "th" ? "ดูทั้งหมด" : "View all",
    },
    story: {
      title:
        locale === "th"
          ? "ทุกเส้นใย คือเรื่องราวของหัตถศิลป์"
          : "Weaving History into Every Thread",
      description:
        locale === "th"
          ? "ผ้าไหมไทยสืบทอดจากช่างฝีมือท้องถิ่นสู่แฟชั่นร่วมสมัย ด้วยเทคนิคการทอที่พิถีพิถันในทุกชิ้นงาน"
          : "Thai silk has been celebrated for centuries. Every piece is hand-woven by local artisans with care.",
      cta: locale === "th" ? "อ่านเรื่องราวของเรา" : "Read Our Story",
    },
    arrivals: {
      badge: locale === "th" ? "สินค้าใหม่" : "Fresh Arrivals",
      title: locale === "th" ? "Pastel & Pure" : "Pastel & Pure",
      description:
        locale === "th"
          ? "สำรวจสินค้าล่าสุดที่โดดเด่นด้วยโทนนุ่มและพื้นผิวพรีเมียม"
          : "Explore our latest additions with soft tones and premium textures.",
      addToCart: locale === "th" ? "เพิ่มลงตะกร้า" : "Add to Cart",
      viewAllProducts: locale === "th" ? "ดูสินค้าทั้งหมด" : "View All Products",
    },
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <Badge className="inline-flex items-center rounded-full border border-secondary bg-secondary/20 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                {dict.hero.badge}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {dict.hero.title.split(", ")[0]},<br />
                <span className="text-primary-foreground/70">{dict.hero.title.split(", ")[1]}</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {dict.hero.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                asChild
                className="h-10 bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                <Link href={`/${locale}/products`}>{dict.hero.shopLatest}</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-10 border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <Link href={`/${locale}/products`}>{dict.hero.viewLookbook}</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last lg:aspect-square">
            <Image
              src={heroImage}
              alt={locale === "th" ? "แฟชั่นผ้าไหมไทยร่วมสมัย" : "Modern fashion made from Thai silk"}
              fill
              className="h-full w-full object-cover object-[center_30%]"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            className="inline-flex h-9 items-center justify-center rounded-full border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
            asChild
          >
            <Link href={`/${locale}/products`}>
              <Grid3x3 className="mr-2 h-4 w-4" />
              {dict.categories.all}
            </Link>
          </Button>
          {dict.categories.list.map((item) => (
            <Button
              key={item}
              variant="outline"
              className="inline-flex h-9 items-center justify-center rounded-full border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              asChild
            >
              <Link href={`/${locale}/products`}>{item}</Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Trending Collections */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">{dict.trending.title}</h2>
            <p className="text-sm text-muted-foreground">{dict.trending.description}</p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center text-sm font-medium hover:underline"
          >
            {dict.trending.viewAll}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingCollections.map((item) => (
            <div
              key={item.image}
              className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-t-lg">
                <Image
                  src={item.image}
                  alt={t(locale, item.title)}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-none tracking-tight">{t(locale, item.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(locale, item.subtitle)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full bg-accent/30 py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted shadow-xl">
              <Image
                src={storyImage}
                alt={locale === "th" ? "ช่างทอผ้าไหมไทย" : "Thai woman weaving silk"}
                fill
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {dict.story.title}
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {dict.story.description}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  className="h-10 bg-foreground px-8 text-sm font-medium text-background shadow hover:bg-foreground/90"
                >
                  <Link href={`/${locale}/products`}>{dict.story.cta}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Arrivals */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="mb-10 flex flex-col items-center justify-center space-y-4 text-center">
          <Badge className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground hover:bg-primary/80">
            {dict.arrivals.badge}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{dict.arrivals.title}</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
            {dict.arrivals.description}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((item) => (
            <div
              key={item.image}
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                {item.badge && (
                  <div className="absolute left-2 top-2 z-10 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold shadow-sm backdrop-blur">
                    {t(locale, item.badge)}
                  </div>
                )}
                <Image
                  src={item.image}
                  alt={t(locale, item.title)}
                  fill
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    asChild
                    className="h-9 w-full bg-primary text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    <Link href={`/${locale}/products`}>{dict.arrivals.addToCart}</Link>
                  </Button>
                </div>
              </div>
              <div className="space-y-1 p-4">
                <h3 className="font-semibold leading-none">{t(locale, item.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(locale, item.subtitle)}</p>
                <div className="pt-1 font-medium">{t(locale, item.price)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            asChild
            className="h-11 border-input bg-background px-8 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            <Link href={`/${locale}/products`}>{dict.arrivals.viewAllProducts}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
