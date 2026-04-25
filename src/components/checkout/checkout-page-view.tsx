"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Alert, Empty, Radio, message } from "antd";

import { AppButton } from "@/components/ui/app-button";
import { AppInput } from "@/components/ui/app-input";
import { SectionToggleButton } from "@/components/ui/section-toggle-button";
import { getCartItemMeta } from "@/lib/cart-item-meta";
import { formatCurrency } from "@/lib/format";
import { clearCart, selectCartItemCount, selectCartItems, selectCartTotal } from "@/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
const PAYSTACK_CURRENCY = process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY ?? "NGN";
const PAYSTACK_ICON = "https://www.losode.com/icons/paystack.png";

interface DeliveryAddress {
  fullName: string;
  street: string;
  cityState: string;
  postalCode: string;
  country: string;
  phone: string;
}

const INITIAL_ADDRESS: DeliveryAddress = {
  fullName: "",
  street: "",
  cityState: "",
  postalCode: "",
  country: "",
  phone: "",
};

export function CheckoutPageView() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);

  const [guestEmail, setGuestEmail] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  const [deliveryAddress, setDeliveryAddress] = useState(INITIAL_ADDRESS);
  const [addressDraft, setAddressDraft] = useState(INITIAL_ADDRESS);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const amountInLowestDenomination = useMemo(() => Math.round(total * 100), [total]);

  const initializePayment = async () => {
    setPaymentError(null);

    if (!PAYSTACK_KEY) {
      setPaymentError(
        "Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY. Add it to your environment file before testing payments.",
      );
      return;
    }

    const paymentEmail = checkoutEmail.trim();

    if (!paymentEmail || !isValidEmail(paymentEmail)) {
      setPaymentError("Provide a valid email address before paying.");
      return;
    }

    if (amountInLowestDenomination <= 0) {
      setPaymentError("Cart total must be greater than zero before checkout.");
      return;
    }

    const [firstName, ...rest] = "Guest Shopper".split(" ");
    const lastName = rest.join(" ");
    const reference = `LS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      setIsPaying(true);

      const PaystackModule = await import("@paystack/inline-js");
      const Paystack = PaystackModule.default;
      const paystack = new Paystack();

      paystack.newTransaction({
        key: PAYSTACK_KEY,
        email: paymentEmail,
        amount: amountInLowestDenomination,
        currency: PAYSTACK_CURRENCY,
        firstName,
        lastName,
        reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer name",
              variable_name: "customer_name",
              value: "Guest Shopper",
            },
            {
              display_name: "Items",
              variable_name: "item_count",
              value: String(itemCount),
            },
            voucherCode
              ? {
                  display_name: "Voucher code",
                  variable_name: "voucher_code",
                  value: voucherCode,
                }
              : undefined,
          ].filter(Boolean) as Array<{
            display_name: string;
            variable_name: string;
            value: string;
          }>,
        },
        onSuccess: ({ reference: transactionReference }) => {
          dispatch(clearCart());
          message.success("Payment successful.");
          router.push(
            `/checkout/confirmation?status=success&reference=${transactionReference || reference}`,
          );
        },
        onCancel: () => {
          router.push(`/checkout/confirmation?status=cancelled&reference=${reference}`);
        },
        onError: ({ message: errorMessage }) => {
          const fallback = "Payment failed. Please try again.";
          setPaymentError(errorMessage || fallback);
          router.push(
            `/checkout/confirmation?status=failed&reference=${reference}&error=${encodeURIComponent(errorMessage || fallback)}`,
          );
        },
      });
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : "Unable to initialize payment at the moment.";
      setPaymentError(fallbackMessage);
    } finally {
      setIsPaying(false);
    }
  };

  const proceedAsGuest = () => {
    const normalizedEmail = guestEmail.trim();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setPaymentError("Provide a valid email address to continue.");
      return;
    }

    setPaymentError(null);
    setCheckoutEmail(normalizedEmail);
    message.success("Checkout details saved.");
  };

  const updateAddressDraft = (field: keyof DeliveryAddress, value: string) => {
    setAddressDraft((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const startAddressEdit = () => {
    setAddressDraft(deliveryAddress);
    setIsEditingAddress(true);
  };

  const saveAddress = () => {
    setDeliveryAddress(addressDraft);
    setIsEditingAddress(false);
    message.success("Delivery address updated.");
  };

  const cancelAddressEdit = () => {
    setAddressDraft(deliveryAddress);
    setIsEditingAddress(false);
  };

  if (items.length === 0) {
    return (
      <section className="rounded-[14px] border border-[#cfcfcf] bg-[#f5f5f5] p-10">
        <Empty
          description="Your cart is empty. Add products first to proceed with checkout."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-10"
        />
        <div className="flex justify-center">
          <Link href="/">
            <AppButton variant="primary" className="!h-11 !px-8 !text-[16px]">
              Browse products
            </AppButton>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-8 bg-[#ededed] xl:grid-cols-[minmax(50%,1fr)_minmax(50%,1fr)] px-4 py-6 sm:px-7 sm:py-8 xl:px-40 2xl:px-52 lg:py-9">
      <div className="space-y-5">
        <section className="bg-[#ffffff] p-6 sm:p-10">
          <div className="flex items-start gap-4">
            <CheckoutIndicatorRadio />

            <div className="flex-1">
              <h1 className="text-[20px] font-semibold leading-none text-[#212121] sm:text-[22px]">
                Continue As Guest
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-[1.4] text-[#2f2f2f]">
                You can choose to continue as a guest now and set up your
                account after your purchase
              </p>

              <label
                htmlFor="guest-email"
                className="mt-8 block text-[15px] font-medium leading-none text-[#222222]"
              >
                Email address
              </label>
              <AppInput
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="assessment@losode.com"
                uiSize="lg"
                className="!mt-3 !border-[#2e2e2e] !bg-[#cfd8e6] !text-[15px] !text-[#1a1a1a]"
              />

              <AppButton
                fullWidth
                variant="primary"
                onClick={proceedAsGuest}
                className="!mt-8 !h-12 !rounded-none !text-[15px]"
              >
                Proceed To Checkout
              </AppButton>

              <p className="mt-4 text-center text-[15px] text-[#2f2f2f]">
                Find out more about our{" "}
                <span className="underline">privacy policy</span>
              </p>
            </div>
          </div>
        </section>

        <CheckoutBlock title="Delivery Country">
          <div className="mt-8 flex items-center gap-4 text-[15px] text-[#2b2b2b]">
            <NigeriaFlag />
            <span>Nigeria</span>
          </div>
        </CheckoutBlock>

        <CheckoutBlock title="Email Address">
          <p className="mt-8 text-[15px] text-[#2b2b2b]">
            {checkoutEmail || "Not provided yet"}
          </p>
        </CheckoutBlock>

        <section className="bg-[#ffffff] p-6 sm:p-10">
          <SectionToggleButton
            expanded={voucherOpen}
            onClick={() => setVoucherOpen((open) => !open)}
            label={
              <span className="text-[20px] font-semibold leading-none text-[#222222] sm:text-[22px]">
                Add a Voucher Code
              </span>
            }
            className="!items-center"
            iconClassName="!text-[14px] !text-[#252525]"
          />
          {voucherOpen ? (
            <AppInput
              type="text"
              value={voucherCode}
              onChange={(event) =>
                setVoucherCode(event.target.value.toUpperCase())
              }
              placeholder="Enter voucher code"
              uiSize="lg"
              className="!mt-5 !border-[#2f2f2f] !bg-white !text-[15px] !text-[#1b1b1b]"
            />
          ) : null}
        </section>

        <section className="bg-[#ffffff] p-6 sm:p-10">
          <h2 className="text-[20px] font-semibold leading-none text-[#222222] sm:text-[22px]">
            Delivery Address
          </h2>
          <p className="mt-4 max-w-4xl text-[15px] leading-[1.4] text-[#2e2e2e]">
            This is the address where your items will be delivered. Select
            <span className="font-semibold">
              {" "}
              &quot;Change Address&quot;
            </span>{" "}
            to update it or add a new address
          </p>

          {isEditingAddress ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <AppInput
                value={addressDraft.fullName}
                onChange={(event) =>
                  updateAddressDraft("fullName", event.target.value)
                }
                placeholder="Full name"
                uiSize="lg"
                className="!text-[15px]"
              />
              <AppInput
                value={addressDraft.phone}
                onChange={(event) =>
                  updateAddressDraft("phone", event.target.value)
                }
                placeholder="Phone number"
                uiSize="lg"
                className="!text-[15px]"
              />
              <AppInput
                value={addressDraft.street}
                onChange={(event) =>
                  updateAddressDraft("street", event.target.value)
                }
                placeholder="Street"
                uiSize="lg"
                className="!text-[15px] sm:col-span-2"
              />
              <AppInput
                value={addressDraft.cityState}
                onChange={(event) =>
                  updateAddressDraft("cityState", event.target.value)
                }
                placeholder="City / State"
                uiSize="lg"
                className="!text-[15px]"
              />
              <AppInput
                value={addressDraft.postalCode}
                onChange={(event) =>
                  updateAddressDraft("postalCode", event.target.value)
                }
                placeholder="Postal code"
                uiSize="lg"
                className="!text-[15px]"
              />
              <AppInput
                value={addressDraft.country}
                onChange={(event) =>
                  updateAddressDraft("country", event.target.value)
                }
                placeholder="Country"
                uiSize="lg"
                className="!text-[15px] sm:col-span-2"
              />

              <div className="mt-2 flex flex-wrap gap-3 sm:col-span-2">
                <AppButton
                  variant="primary"
                  className="!h-12 !min-w-[160px] !rounded-none !px-8 !text-[15px]"
                  onClick={saveAddress}
                >
                  Save Address
                </AppButton>
                <AppButton
                  variant="outline"
                  className="!h-12 !min-w-[160px] !rounded-none !px-8 !text-[15px]"
                  onClick={cancelAddressEdit}
                >
                  Cancel
                </AppButton>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-start gap-4">
                <CheckoutIndicatorRadio />
                <div className="space-y-1 text-[15px] leading-[1.4] text-[#222222]">
                  <p className="uppercase">{deliveryAddress.fullName}</p>
                  <p>
                    {deliveryAddress.street} {deliveryAddress.cityState}
                  </p>
                  <p>{deliveryAddress.postalCode}</p>
                  <p>{deliveryAddress.country}</p>
                  <p>{deliveryAddress.phone}</p>
                </div>
              </div>

              <AppButton
                variant="primary"
                className="!mt-8 !h-12 !min-w-[220px] !rounded-none !px-8 !text-[15px]"
                onClick={startAddressEdit}
              >
                Change Address
              </AppButton>
            </>
          )}
        </section>

        <section className="bg-[#ffffff] p-6 sm:p-10">
          <h2 className="text-[20px] font-semibold leading-none text-[#222222] sm:text-[22px]">
            Select Your Payment Option
          </h2>
          <p className="mt-4 text-[15px] text-[#2f2f2f]">
            Select a delivery option before you can make payments
          </p>

          <div className="mt-6 border-b border-[#afafaf] py-4">
            <label className="flex items-center gap-5" aria-label="Paystack">
              <CheckoutIndicatorRadio />
              <Image
                src={PAYSTACK_ICON}
                alt="Paystack"
                width={96}
                height={24}
                className="h-auto w-auto object-contain"
                unoptimized
              />
            </label>
          </div>

          {paymentError ? (
            <Alert
              className="!mt-5"
              type="error"
              showIcon
              message="Payment initialization failed"
              description={paymentError}
            />
          ) : null}

          <AppButton
            fullWidth
            variant="outline"
            onClick={initializePayment}
            disabled={!checkoutEmail || isPaying}
            className="!mt-8 !h-12 !rounded-none !border-[#2d2d2d] !bg-[#f5f5f5] !text-[15px] !text-[#acacac] enabled:!bg-black enabled:!text-white enabled:hover:!bg-[#151515]"
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </AppButton>
        </section>
      </div>

      <aside className="space-y-4 bg-white p-6 sm:p-10">
        <div className="flex border-b pb-4 border-[#2d2d2d]! flex-col items-center">
          <span className="text-4xl font-semibold"> Order Information</span>
          <span>({itemCount} items)</span>
        </div>
        {items.map((item) => {
          const meta = getCartItemMeta(item);
          const isExpanded = !collapsedItems.has(item.productId);

          return (
            <article
              key={item.productId}
              className="rounded-[12px] border border-[#bdbdbd] bg-[#ffffff] p-5 sm:p-6"
            >
              <header>
                <SectionToggleButton
                  expanded={isExpanded}
                  onClick={() =>
                    setCollapsedItems((previous) => {
                      const next = new Set(previous);

                      if (next.has(item.productId)) {
                        next.delete(item.productId);
                      } else {
                        next.add(item.productId);
                      }

                      return next;
                    })
                  }
                  label={
                    <span className="text-[15px] font-semibold">
                      {meta.vendor}{" "}
                      <span className="font-normal lowercase text-[#6b6b6b]">
                        ({item.quantity} item)
                      </span>
                    </span>
                  }
                  className="!text-[15px] !font-semibold !uppercase !text-[#1d1d1d]"
                  iconClassName="!text-[14px]"
                  aria-expanded={isExpanded}
                  aria-controls={`checkout-item-${item.productId}`}
                />
              </header>

              {isExpanded ? (
                <div
                  id={`checkout-item-${item.productId}`}
                  className="mt-6 flex gap-4"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={132}
                    height={200}
                    className="h-[120px] w-[92px] object-cover"
                    unoptimized
                  />

                  <div className="min-w-0">
                    <p className="text-[15px] leading-[1.4] text-[#202124]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-[15px] text-[#232323]">
                      {meta.color}{" "}
                      <span className="px-2 text-[#a8a8a8]">|</span>
                      {meta.size}
                    </p>
                    <p className="mt-2 text-[15px] text-[#252525]">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-4 text-[14px] font-semibold leading-none text-[#111111]">
                      {formatCurrency(
                        item.price * item.quantity,
                        PAYSTACK_CURRENCY,
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}

        <section className="p-6 sm:p-8">
          <div className="flex items-center justify-between text-[15px] text-[#393b3d]">
            <span>Subtotal ({itemCount} items)</span>
            <span>{formatCurrency(total, PAYSTACK_CURRENCY)}</span>
          </div>
        </section>
      </aside>
    </section>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function CheckoutBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-[#ffffff] p-6 sm:p-10">
      <h2 className="text-[20px] font-semibold leading-none text-[#222222] sm:text-[22px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function CheckoutIndicatorRadio() {
  return (
    <Radio checked className="checkout-indicator-radio !m-0 !pointer-events-none" />
  );
}

function NigeriaFlag() {
  return (
    <span className="inline-flex h-8 w-8 overflow-hidden rounded-full border border-[#c5c5c5]">
      <span className="w-1/3 bg-[#148f5f]" />
      <span className="w-1/3 bg-white" />
      <span className="w-1/3 bg-[#148f5f]" />
    </span>
  );
}
