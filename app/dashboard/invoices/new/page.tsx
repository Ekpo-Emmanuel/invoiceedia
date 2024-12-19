'use client'

import React, { useState, SyntheticEvent } from "react";
import SubmitButton from "@/components/custom/SubmitButton";
import { createAction } from "@/app/actions";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import { toast } from 'sonner'


export default function Page() {
  const [state, setState] = useState("ready");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    amount: "",
  });

  const validateForm = () => {
    const newErrors = { name: "", email: "", amount: "" };
    let isValid = true;

    if (!name) {
      newErrors.name = "Please enter name.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = "Please enter a valid amount.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function handleOnSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (state === "pending") return;

    if (!validateForm()) {
      return;
    }

    setState("pending");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("value", amount);
    formData.append("description", description);

    try {
        await createAction(formData);
        setState("ready");
        toast.success(`New invoice has been created`);
    } catch (error) {
        console.error(error);
        setState("ready");
    }
  }

  return (
    <div className="">
      <div className="max-w-lg mx-auto px-4 ">
        <div className="gap-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold">Create New Invoice</h2>

          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">
                    <Link href="/dashboard/invoices/new">Create Invoice</Link>
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        <form
        //   action={createAction}
          onSubmit={handleOnSubmit}
          className="mx-auto mt-12 max-w-lg"
        >
          <div className="flex flex-col gap-y-6">
            <div>
              <label
                htmlFor="name"
                className="text-gray leading-normal text-gray-700 font-medium"
              >
                Billing Name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                  }}
                //   required
                  aria-required="true"
                  aria-describedby="name-error"
                  placeholder="Enter name"
                  className={clsx(
                    "block w-full h-10 px-4 py-2 text-sm text-gray-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-gray-300 placeholder-gray-400 focus:border-gray-300 focus:bg-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"
                  )}
                />
                {errors.name && (
                  <span id="name-error" className="text-red-600 text-sm">
                    {errors.name}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-gray leading-normal text-gray-700 font-medium"
              >
                Billing Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
                  }}
                //   required
                  aria-required="true"
                  aria-describedby="email-error"
                  placeholder="Enter email"
                  className="block w-full h-10 px-4 py-2 text-sm text-gray-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-gray-300 placeholder-gray-400 focus:border-gray-300 focus:bg-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"
                />
                {errors.email && (
                  <span id="email-error" className="text-red-600 text-sm">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="value"
                className="text-gray leading-normal text-gray-700 font-medium"
              >
                Amount
              </label>
              <div className="mt-2.5 relative">
                <span className="absolute left-3 top-2.5 text-gray-700 text-sm">
                  $
                </span>
                <input
                  type="text"
                  name="value"
                  id="value"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrors((prevErrors) => ({ ...prevErrors, amount: "" }));
                  }}
                //   required
                  aria-required="true"
                  aria-describedby="value-error"
                  placeholder="Enter Amount"
                  className="block w-full h-10 px-8 py-2 text-sm text-gray-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-gray-300 placeholder-gray-400 focus:border-gray-300 focus:bg-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9]/g,
                      ""
                    );
                  }}
                />
                {errors.amount && (
                  <span id="value-error" className="text-red-600 text-sm">
                    {errors.amount}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="text-gray leading-normal text-gray-700 font-medium"
              >
                Description
              </label>
              <div className="mt-2.5">
                <textarea
                  name="description"
                  id="description"
                //   required
                  aria-required="true"
                  aria-describedby="description-error"
                  placeholder="Type your message here..."
                  className="block w-full px-4 py-2 text-sm text-gray-700 duration-300 bg-white border border-transparent rounded-lg appearance-none ring-1 ring-gray-300 placeholder-gray-400 focus:border-gray-300 focus:bg-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 sm:text-sm"
                ></textarea>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}