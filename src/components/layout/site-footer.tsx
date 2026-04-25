"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, Input, Layout } from "antd";

const USEFUL_INFORMATION_LINKS = [
  "About Us",
  "Fashion and Climate",
  "Our Terms",
  "Our Privacy Policy",
  "Shipping and Delivery",
  "FAQs",
  "Sell on Losode",
];

const CUSTOMER_LINKS = [
  "Track an Order",
  "Create a Return",
  "Book a Photoshoot",
  "Returns and Refunds",
  "Our Designers",
  "Contact Us",
];

const SOCIAL_ICONS = [
  { label: "Instagram", href: "https://www.losode.com/icons/new-footer-instagram-icon.svg" },
  { label: "Facebook", href: "https://www.losode.com/icons/new-footer-facebook-icon.svg" },
  { label: "YouTube", href: "https://www.losode.com/icons/new-footer-youtube-icon.svg" },
  { label: "X", href: "https://www.losode.com/icons/new-footer-x-icon.svg" },
  { label: "LinkedIn", href: "https://www.losode.com/icons/new-footer-linnkedin-icon.svg" },
];

const PAYMENT_ICONS = [
  {
    label: "Mastercard",
    href: "https://www.losode.com/icons/mastercard_inverse.svg",
  },
  {
    label: "Flutterwave",
    href: "https://www.losode.com/icons/flutter-inverse.svg",
  },
  { label: "PayPal", href: "https://www.losode.com/icons/paypal_inverse.svg" },
  { label: "Visa", href: "https://www.losode.com/icons/visa_inverse.svg" },
  { label: "Losode", href: "https://www.losode.com/icons/losode_vector.svg" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <Layout.Footer className="!mt-20 !bg-transparent !p-0">
      <section className="border-t border-[#d7d7d7] bg-[#e9e9e9]">
        <div className="mx-auto w-full max-w-[2048px] px-4 py-14 sm:px-8 lg:px-20 lg:py-12">
          <div className="grid gap-14 lg:grid-cols-[1.08fr_1fr]">
            <div>
              <h2 className="text-[10px] font-mono font-semibold tracking-tight leading-[1.15] text-[#171717] sm:text-[16px]">
                Get a Discount off your First Order on Losode
              </h2>
              <p className="mt-6 max-w-[820px] text-[8px] leading-[1.45] text-[#2f2f2f] sm:text-[12px]">
                Enjoy 10% off your first order when you sign up to our newsletter.
                <br />
                Be the first to hear about new arrivals, exclusive offers, and more.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  placeholder="Enter your email"
                  className="losode-footer-email !h-[52px] !w-full !max-w-[640px] !rounded-none !border-[#bdbdbd] !bg-white !text-[16px]"
                />
                <Button
                  type="primary"
                  className="!h-[52px] !rounded-none !border-black !bg-black !px-8 !text-[17px] !font-medium hover:!border-[#171717] hover:!bg-[#171717]"
                >
                  Subscribe
                </Button>
              </div>

              <div className="mt-20 flex items-center gap-8">
                {SOCIAL_ICONS.map((social) => (
                  <Link key={social.label} href="/" aria-label={social.label}>
                    <Image
                      src={social.href}
                      alt={social.label}
                      width={30}
                      height={30}
                      unoptimized
                      className="h-[30px] w-[30px] object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-10 lg:pl-10">
              <div>
                <h3 className="text-[24px] font-semibold leading-[1.12] text-[#141414] sm:text-[30px]">
                  Need Help?
                </h3>
                <p className="mt-5 text-[16px] leading-[1.45] text-[#2e2e2e] sm:text-[18px]">
                  For any enquires, please contact our User Engagement Call Centre
                  <br />
                  02013306011 or send an email to hello@losode.com
                </p>
              </div>

              <div>
                <h3 className="text-[24px] font-semibold leading-[1.15] text-[#151515] sm:text-[30px]">
                  Location and Currency
                </h3>
                <div className="mt-4 flex items-center gap-4 text-[17px] text-[#171717]">
                  <NigeriaFlagIcon />
                  <span>NGN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(120deg,#252628_0%,#2c2d30_100%)] text-[#f2f2f2]">
        <div className="mx-auto w-full max-w-[2048px] px-4 py-12 sm:px-8 lg:px-20 lg:py-11">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.12fr_1.3fr]">
            <section>
              <h3 className="text-[30px] font-semibold leading-none text-[#f0f0f0] sm:text-[34px]">
                Useful Information
              </h3>
              <ul className="mt-8 space-y-5">
                {USEFUL_INFORMATION_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="/" className="text-[16px] leading-none text-[#cecece] hover:text-[#f2f2f2] sm:text-[17px]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-[30px] font-semibold leading-none text-[#f0f0f0] sm:text-[34px]">
                Customers and Designers
              </h3>
              <ul className="mt-8 space-y-5">
                {CUSTOMER_LINKS.map((item) => (
                  <li key={item}>
                    <Link href="/" className="text-[16px] leading-none text-[#cecece] hover:text-[#f2f2f2] sm:text-[17px]">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="lg:pl-4">
              <Link
                href="/"
                aria-label="Losode home"
                className="font-serif text-[72px] leading-[0.8] tracking-[-0.04em] text-[#f2f2f2] sm:text-[86px]"
              >
                losode
              </Link>
              <p className="mt-10 text-[17px] text-[#ececec]">
                We accept payment from these providers:
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                {PAYMENT_ICONS.map((icon) => (
                  <span
                    key={icon.label}
                    className="inline-flex h-12 min-w-[72px] items-center justify-center rounded-md  px-2"
                  >
                    <Image
                      src={icon.href}
                      alt={icon.label}
                      width={40}
                      height={26}
                      unoptimized
                      className="h-auto w-auto max-w-11 opacity-95"
                    />
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-white/20 pt-4 text-[16px] text-[#e4e4e4]">
            <span>© {year}, Losode Inc.</span>{" "}
            <span className="text-[#8e8e8e]">Always Beyond Borders</span>
          </div>
        </div>
      </section>
    </Layout.Footer>
  );
}

function NigeriaFlagIcon() {
  return (
    <span className="relative block h-8 w-8 overflow-hidden rounded-full border border-[#d7d7d7]">
      <span className="absolute inset-y-0 left-0 w-1/3 bg-[#0d8d5c]" />
      <span className="absolute inset-y-0 left-1/3 w-1/3 bg-[#ffffff]" />
      <span className="absolute inset-y-0 right-0 w-1/3 bg-[#0d8d5c]" />
    </span>
  );
}
