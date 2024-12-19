'use client'

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, CreditCard, LineChart, Shield } from 'lucide-react'
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container space-y-8 py-12 text-center md:py-24 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-[64rem] space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Professional Invoicing{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Create, send, and track invoices with ease. Perfect for freelancers, small businesses, and enterprises.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-x-4"
            >
              <Button size="lg" asChild>
                <Link href="/sign-up" className="gap-2">
                  Start for Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mx-auto aspect-video max-w-5xl rounded-lg border bg-gradient-to-b from-background to-muted shadow-2xl"
          >
            {/* Replace with your actual app screenshot/demo */}
            <div className="h-full w-full rounded-lg bg-muted/30 p-8">
              <div className="h-full w-full rounded border border-border/50" />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container py-16 md:py-24 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg border bg-background p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Instant Payments</h3>
              <p className="mt-2 text-muted-foreground">
                Accept payments instantly with integrated payment processing through Stripe.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg border bg-background p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Secure & Reliable</h3>
              <p className="mt-2 text-muted-foreground">
                Bank-level security with encrypted data storage and secure payment processing.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg border bg-background p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Analytics & Insights</h3>
              <p className="mt-2 text-muted-foreground">
                Track payments, generate reports, and gain valuable insights into your business.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section className="border-t bg-gray-50/50">
            <div className="max-w-7xl w-full mx-auto">
            <div className="container py-16 md:py-24">
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="mx-auto max-w-[58rem] text-center"
                >
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                    Simple, transparent pricing
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Choose the perfect plan for your business needs
                </p>
                </motion.div>

                <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                {/* Free Plan */}
                <div className="relative overflow-hidden rounded-lg border bg-background p-8">
                    <h3 className="text-lg font-semibold">Free</h3>
                    <p className="mt-2 text-muted-foreground">Perfect for getting started</p>
                    <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                    {['5 invoices per month', 'Basic templates', 'Email support'].map((feature) => (
                        <li key={feature} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                        </li>
                    ))}
                    </ul>
                    <Button className="mt-8 w-full" variant="outline">
                    Get Started
                    </Button>
                </div>

                {/* Pro Plan */}
                <div className="relative overflow-hidden rounded-lg border bg-background p-8 shadow-lg">
                    <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-primary/10" />
                    <h3 className="text-lg font-semibold">Pro</h3>
                    <p className="mt-2 text-muted-foreground">For growing businesses</p>
                    <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                    {[
                        'Unlimited invoices',
                        'Custom templates',
                        'Priority support',
                        'Analytics dashboard',
                    ].map((feature) => (
                        <li key={feature} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                        </li>
                    ))}
                    </ul>
                    <Button className="mt-8 w-full">
                    Get Started
                    </Button>
                </div>

                {/* Enterprise Plan */}
                <div className="relative overflow-hidden rounded-lg border bg-background p-8">
                    <h3 className="text-lg font-semibold">Enterprise</h3>
                    <p className="mt-2 text-muted-foreground">For large organizations</p>
                    <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">Custom</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                    {[
                        'Custom integration',
                        'Dedicated support',
                        'SLA agreement',
                        'Custom features',
                    ].map((feature) => (
                        <li key={feature} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                        </li>
                    ))}
                    </ul>
                    <Button className="mt-8 w-full" variant="outline">
                    Contact Sales
                    </Button>
                </div>
                </motion.div>
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="border-t max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container flex flex-col items-center gap-4 py-16 text-center md:py-24"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to streamline your invoicing?
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Join thousands of businesses who trust InvoiceMaker for their invoicing needs.
            </p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/register">
                Get Started for Free
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

