"use client";
import React, { useState } from "react";

const NewsLetterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const name = formData.get("name");
    const surName = formData.get("surName");
    const isNewsletter = formData.get("newsletter");
    const isSubscriber = formData.get("subscriber");

    const newsletter = isNewsletter ? "Newsletter" : undefined;
    const subscriber = isSubscriber ? "Subscriber" : undefined;

    try {
      const res = await fetch("/api/subscribe-user", {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, surName, newsletter, subscriber }),
      });

      const data = await res.json();

      if (data?.success) {
        event.target.reset();
        setIsSubmitting(false);
        setMessage("Your subscription was successful!");
        setMessageType("success");
      } else {
        setIsSubmitting(false);
        setMessage(data?.error || "Failed to subscribe. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setIsSubmitting(false);
      setMessage("Something went wrong");
      setMessageType("error");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col ">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col ">
            <label
              htmlFor="surName"
              className="block text-sm font-medium text-gray-700"
            >
              Sur Name:
            </label>
            <input
              type="text"
              id="surName"
              name="surName"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col ">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex flex-col ">
            <label htmlFor="newsletter" className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                className="h-4 w-4"
              />
              Newsletter
            </label>
          </div>
          <div className="flex flex-col ">
            <label htmlFor="subscriber" className="flex items-center gap-2">
              <input
                type="checkbox"
                id="subscriber"
                name="subscriber"
                className="h-4 w-4"
              />
              Subscriber
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
        >
          {isSubmitting ? (
            <div
              className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full"
              role="status"
            ></div>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 text-sm font-medium ${
            messageType === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default NewsLetterForm;
