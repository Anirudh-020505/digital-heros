# 🎨 COMPONENT INTEGRATION EXAMPLES

Complete examples showing how to integrate the backend hooks into your React components.

---

## 📋 TABLE OF CONTENTS

1. [Score Submission](#score-submission)
2. [Subscription Checkout](#subscription-checkout)
3. [Winner Verification](#winner-verification)
4. [Draw Management](#draw-management)
5. [Common Patterns](#common-patterns)

---

## 🏌️ SCORE SUBMISSION

### Basic Score Entry Component

```typescript
// components/ScoreEntry.tsx
import { useState } from "react";
import { useScoreSubmission, useRecentScores } from "@/hooks/useScoreSubmission";

export function ScoreEntry({ userId }: { userId: string }) {
  const [value, setValue] = useState("");
  
  // Mutations & queries
  const { submitScore, isPending, error: submitError } = useScoreSubmission({
    userId,
    onSuccess: () => {
      alert("Score submitted successfully!");
      setValue("");
    },
    onError: (error) => {
      if (error.code === "DUPLICATE_SCORE") {
        alert("You already submitted a score today. Try tomorrow!");
      } else {
        alert(`Error: ${error.message}`);
      }
    },
  });

  const { data: scores, isLoading: loadingScores } = useRecentScores(userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numValue = parseInt(value);
    if (numValue < 1 || numValue > 45) {
      alert("Score must be between 1 and 45");
      return;
    }
    submitScore(numValue);
  };

  return (
    <div className="space-y-6">
      {/* Score Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Golf Score</label>
          <input
            type="number"
            min="1"
            max="45"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
            placeholder="Enter score (1-45)"
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower is better! Valid range: 1-45
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{submitError.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !value}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isPending ? "Submitting..." : "Submit Score"}
        </button>
      </form>

      {/* Recent Scores Display */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Scores</h3>
        
        {loadingScores ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : scores && scores.length > 0 ? (
          <div className="space-y-2">
            {scores.map((score, index) => (
              <div
                key={score.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">#{index + 1} Score</p>
                  <p className="text-xs text-gray-500">
                    {new Date(score.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{score.value}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No scores yet. Submit your first!</p>
        )}
      </div>
    </div>
  );
}
```

### Score Submission with Historical Data

```typescript
// components/ScoreHistory.tsx
import { useRecentScores } from "@/hooks/useScoreSubmission";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export function ScoreHistory({ userId }: { userId: string }) {
  const { data: scores } = useRecentScores(userId);

  const chartData = scores
    ? [...scores].reverse().map((s) => ({
        date: new Date(s.date).toLocaleDateString("en-US", { 
          month: "short", 
          day: "numeric" 
        }),
        value: s.value,
      }))
    : [];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Score Trend</h2>
      {chartData.length > 0 ? (
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 45]} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2563eb"
            dot={{ fill: "#2563eb" }}
            isAnimationActive={true}
          />
        </LineChart>
      ) : (
        <p className="text-gray-500">No data to display</p>
      )}
    </div>
  );
}
```

---

## 💳 SUBSCRIPTION CHECKOUT

### Subscription Button Component

```typescript
// components/SubscriptionButton.tsx
import { useSubscriptionCheckout } from "@/hooks/useSubscriptionCheckout";
import { useState } from "react";

export function SubscriptionButton({ userId }: { userId: string }) {
  const [selectedPlan, setSelectedPlan] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  
  const { checkout, isPending, error } = useSubscriptionCheckout({
    userId,
    onError: (error) => {
      alert(`Subscription error: ${error.message}`);
    },
  });

  const handleCheckout = async () => {
    await checkout(selectedPlan);
    // Hook automatically handles Stripe redirect
  };

  const pricingData = [
    {
      plan: "MONTHLY",
      price: 25,
      billing: "per month",
      features: ["Full golf score tracking", "Monthly lottery draw", "Winner payouts"],
    },
    {
      plan: "YEARLY",
      price: 250,
      billing: "per year",
      features: [
        "Full golf score tracking",
        "Monthly lottery draws (12x)",
        "Winner payouts",
        "20% savings vs monthly",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {pricingData.map((item) => (
          <div
            key={item.plan}
            onClick={() => setSelectedPlan(item.plan as "MONTHLY" | "YEARLY")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition ${
              selectedPlan === item.plan
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">{item.plan}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">${item.price}</span>
              <span className="text-gray-600 text-sm ml-2">{item.billing}</span>
            </div>
            <ul className="space-y-2 mb-6">
              {item.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <div
              className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                selectedPlan === item.plan
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {selectedPlan === item.plan ? "✓ Selected" : "Select"}
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isPending}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition"
      >
        {isPending ? "Redirecting to Stripe..." : "Subscribe Now"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You can cancel anytime. No commitments.
      </p>
    </div>
  );
}
```

### Checkout Success/Cancel Handler

```typescript
// components/CheckoutStatus.tsx
import { useEffect } from "react";
import { useCheckoutReturn } from "@/hooks/useSubscriptionCheckout";
import { useNavigate } from "@tanstack/react-router";

export function CheckoutStatus() {
  const { status } = useCheckoutReturn();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      // Refresh subscription data
      setTimeout(() => navigate({ to: "/dashboard" }), 3000);
    }
  }, [status]);

  return (
    <div className="max-w-md mx-auto mt-8">
      {status === "success" ? (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-900 mb-2">
            Subscription Activated!
          </h2>
          <p className="text-green-700 text-sm mb-4">
            Your subscription is now active. You can participate in this month's draw!
          </p>
          <p className="text-xs text-gray-500">
            Redirecting to dashboard in 3 seconds...
          </p>
        </div>
      ) : status === "canceled" ? (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <div className="text-4xl mb-4">⚠</div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Checkout Canceled
          </h2>
          <p className="text-yellow-700 text-sm">
            No charges were made. Feel free to retry or contact support.
          </p>
        </div>
      ) : null}
    </div>
  );
}
```

---

## 🏆 WINNER VERIFICATION

### Winner Proof Upload Component

```typescript
// components/WinnerProofUpload.tsx
import { useState } from "react";
import { useWinnerVerification } from "@/hooks/useWinnerVerification";
import { Upload, Check, AlertCircle } from "lucide-react";

interface WinnerProofUploadProps {
  userId: string;
  drawId: string;
  winnerTier: 1 | 2 | 3;
  prizeAmount: number;
}

export function WinnerProofUpload({
  userId,
  drawId,
  winnerTier,
  prizeAmount,
}: WinnerProofUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const { uploadProof, isPending, error, isSuccess } = useWinnerVerification({
    userId,
    drawId,
    onSuccess: () => {
      setTimeout(() => window.location.href = "/dashboard/verifications", 2000);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      alert("File must be an image (JPEG, PNG, GIF, WebP)");
      return;
    }

    setFileName(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const input = document.getElementById("file-input") as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      uploadProof(file);
    }
  };

  const tierLabels = { 1: "Jackpot (Tier 1)", 2: "Second Prize (Tier 2)", 3: "Third Prize (Tier 3)" };

  if (isSuccess) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">Proof Submitted!</h3>
        <p className="text-green-700 text-sm mb-4">
          Your winning proof has been submitted for verification.
        </p>
        <p className="text-xs text-gray-600">
          We'll review it within 24 hours and process your payout.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Prize Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 mb-1">
          <span className="font-semibold">Congratulations!</span> You won:
        </p>
        <p className="text-2xl font-bold text-blue-600">${prizeAmount.toFixed(2)}</p>
        <p className="text-xs text-blue-700 mt-1">{tierLabels[winnerTier]}</p>
      </div>

      {/* Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-64 object-contain mb-4 rounded"
            />
            <p className="text-sm font-medium text-gray-700 mb-3">
              {fileName}
            </p>
            <button
              onClick={() => setPreview(null)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Choose Different Image
            </button>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-2">
              Upload winning proof
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Screenshot, photo, or document showing your win
            </p>
            <label className="inline-block">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer
                             hover:bg-blue-700 text-sm font-medium">
                Select Image
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-3">
              Max 5MB • Supports JPEG, PNG, GIF, WebP
            </p>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={isPending || !preview}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition"
      >
        {isPending ? "Uploading..." : "Submit Proof"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Admin will review within 24 hours. Prize paid via Stripe payout.
      </p>
    </div>
  );
}
```

---

## 🎰 DRAW MANAGEMENT (ADMIN)

### Draw Admin Dashboard

```typescript
// components/DrawAdminDashboard.tsx
import { useState } from "react";
import { useAdminDraws, useDrawDetails } from "@/hooks/useAdminDraw";
import { Loader, Plus, Eye, Trash2, Check } from "lucide-react";

export function DrawAdminDashboard() {
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);
  const [newMonth, setNewMonth] = useState(new Date().getMonth() + 1);
  const [newYear, setNewYear] = useState(new Date().getFullYear());

  const {
    draws,
    isLoading: drawsLoading,
    createDraw,
    deleteDraw,
    isCreating,
    isDeleting,
  } = useAdminDraws();

  const {
    draw,
    isLoading: detailsLoading,
    updateDraw,
    publishDraw,
    isUpdating,
    isPublishing,
  } = useDrawDetails(selectedDrawId || "");

  const handleCreateDraw = async () => {
    await createDraw(newMonth, newYear);
    setNewMonth(newMonth === 12 ? 1 : newMonth + 1);
  };

  const handlePublish = async () => {
    await updateDraw({ winningNumbers: [7, 14, 21, 28, 35] });
    await publishDraw();
  };

  return (
    <div className="space-y-8">
      {/* Create New Draw */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Create New Draw</h2>
        <div className="flex gap-4">
          <select
            value={newMonth}
            onChange={(e) => setNewMonth(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={newYear}
            onChange={(e) => setNewYear(parseInt(e.target.value))}
            className="px-3 py-2 border rounded-lg w-24"
          />

          <button
            onClick={handleCreateDraw}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 disabled:bg-gray-300"
          >
            {isCreating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create
          </button>
        </div>
      </div>

      {/* Draws List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">All Draws</h2>
        </div>

        {drawsLoading ? (
          <div className="p-6 text-center">
            <Loader className="w-6 h-6 animate-spin mx-auto text-gray-400" />
          </div>
        ) : draws?.length ? (
          <div className="divide-y divide-gray-200">
            {draws.map((draw) => (
              <div
                key={draw.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setSelectedDrawId(draw.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {new Date(2024, draw.month - 1).toLocaleString("default", {
                        month: "long",
                      })}{" "}
                      {draw.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="font-medium">{draw.status}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawId(draw.id);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    {draw.status === "DRAFT" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDraw(draw.id);
                        }}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-100 rounded-lg disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-center text-gray-500">No draws yet</p>
        )}
      </div>

      {/* Draw Details */}
      {selectedDrawId && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          {detailsLoading ? (
            <Loader className="w-6 h-6 animate-spin text-gray-400" />
          ) : draw ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {new Date(2024, draw.month - 1).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {draw.year} - {draw.status}
              </h3>

              {draw.status === "DRAFT" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Winning Numbers: {draw.winningNumbers?.join(", ") || "Not set"}
                  </p>
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium
                               hover:bg-green-700 disabled:bg-gray-300 flex gap-2 items-center"
                  >
                    {isPublishing ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Publish Draw
                      </>
                    )}
                  </button>
                </div>
              )}

              {draw.status === "PUBLISHED" && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Winning Numbers</p>
                    <p className="text-lg font-semibold">{draw.winningNumbers?.join(", ")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Prize Pool</p>
                      <p className="text-xl font-bold">${draw.prizePool.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tier 1 Rollover</p>
                      <p className="text-xl font-bold">${draw.tier1Rollover.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
```

---

**All components integrate seamlessly with the backend APIs!**
