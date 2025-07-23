import PayButton from "@/components/Payment";

export default function CheckoutPage() {
  const dummyOrderId = "ORDER123";
  const dummyAmount = 100000; 
  const dummyProduct = "Pembelian Kaos ChillShop";
  const dummyEmail = "customer@example.com";
  const dummyPhone = "08123456789";

  return (
    <main className="p-10">
      <h1 className="text-2xl mb-4">Checkout</h1>
      <PayButton
        amount={dummyAmount}
        orderId={dummyOrderId}
        productDetails={dummyProduct}
        email={dummyEmail}
        phoneNumber={dummyPhone}
      />
    </main>
  );
}
