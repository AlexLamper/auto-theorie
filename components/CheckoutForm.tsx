"use client"

import React, { useState } from "react"
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"

export default function CheckoutForm({ planLabel, amount }: { planLabel: string, amount: string }) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/betaling/geslaagd`,
      },
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Er is een fout opgetreden.")
    } else {
      setMessage("Er is een onverwachte fout opgetreden.")
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Pakket:</span>
          <span className="font-bold text-slate-900 dark:text-white">{planLabel}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-medium text-slate-500">Totaal:</span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">€{amount}</span>
        </div>
      </div>

      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
      >
        <span id="button-text">
          {isLoading ? "Verwerken..." : `Betaal €${amount}`}
        </span>
      </Button>
      
      {message && (
        <div id="payment-message" className="text-sm text-red-500 text-center font-medium mt-4">
          {message}
        </div>
      )}
    </form>
  )
}
