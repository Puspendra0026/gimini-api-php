import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const sendMessage = async () => {
        const trimmedInput = input.trim();
        const isValid = /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(trimmedInput);

        setError("");
        setResponse("");

        if (trimmedInput === "") {
            setError("Message cannot be empty.");
            return;
        }

        if (!isValid) {
            setError(
                "Only letters, numbers, and basic punctuation are allowed."
            );
            return;
        }

        setResponse("Let the AI think...");

        try {
            const API_KEY = "Your-API-Key";
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: trimmedInput }] }],
                    }),
                }
            );

            const data = await res.json();
            const aiResponse =
                data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No response.";
            setResponse(aiResponse);
            setInput("");
        } catch (err) {
            console.error(err);
            setResponse("Error talking to AI.");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="text-gray-900 mb-4 font-semibold">
                            You're logged in!
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                maxLength={250}
                                placeholder="Type your message..."
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <button
                                onClick={sendMessage}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                            >
                                Send
                            </button>

                            {error && (
                                <div className="text-red-600 font-medium">
                                    {error}
                                </div>
                            )}

                            {response && (
                                <div className="mt-4 p-4 bg-gray-100 rounded shadow text-gray-800 whitespace-pre-line">
                                    {response}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
