import { MessageCircle } from "lucide-react";

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
            Your Organisation information could not be verified. Please upload a
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
            <a
              href='https://wa.me/919101035038'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm'
            >
              <MessageCircle size={18} fill='white' strokeWidth={0} />
              Upload on WhatsApp
            </a>
            <p className='text-xs text-gray-500 mt-2 text-center'>
              Upload by using WhatsApp
            </p>
          </div>
        </div>

        <div className='h-6' />
      </div>
    </div>
  );
}
