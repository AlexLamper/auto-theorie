export const EXAM_BUNDLES = {
  EXAM_5: {
    id: "bundle_5",
    label: "5 Examens",
    amount: 5,
    priceIdEnvKey: "STRIPE_PRICE_BUNDLE_5"
  },
  EXAM_10: {
    id: "bundle_10",
    label: "10 Examens",
    amount: 10,
    priceIdEnvKey: "STRIPE_PRICE_BUNDLE_10"
  },
  EXAM_20: {
    id: "bundle_20",
    label: "20 Examens",
    amount: 20,
    priceIdEnvKey: "STRIPE_PRICE_BUNDLE_20"
  }
} as const;

export type ExamBundleId = keyof typeof EXAM_BUNDLES;
