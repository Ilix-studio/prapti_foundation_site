import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TagVariant = "fe" | "be" | "admin" | "infra";

interface LineItem {
  name: string;
  components: string;
  scope: string;
  complexity: "Simple" | "Medium" | "Complex";
  charge: number;
  tag: TagVariant;
}

interface TotalRow {
  label: string;
  value: string;
  variant?: "default" | "discount" | "grand";
}

interface NoteBox {
  title: string;
  highlight?: boolean;
  content: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<TagVariant, string> = {
  fe: "bg-blue-50 text-blue-700",
  be: "bg-red-50 text-red-800",
  admin: "bg-purple-50 text-purple-800",
  infra: "bg-yellow-50 text-yellow-800",
};

const TAG_LABELS: Record<TagVariant, string> = {
  fe: "Frontend",
  be: "Backend",
  admin: "Admin",
  infra: "Infra",
};

const FRONTEND_ITEMS: LineItem[] = [
  {
    name: "Public Interface & Core Pages",
    components: "Home, AboutUs, ContactUs, SupportUs, GalleryPage, ViewAllAwards",
    scope: "Responsive layouts, intuitive navigation, and Foundation branding",
    complexity: "Medium",
    charge: 4000,
    tag: "fe",
  },
  {
    name: "Animal Rescue & Adoption Flow",
    components: "AdoptionForm, ReportPage, ViewAllRescue, ViewRescue",
    scope: "Multi-step form schemas, file attachment handling for rescue reports",
    complexity: "Medium",
    charge: 3500,
    tag: "fe",
  },
  {
    name: "Community & Volunteer UI",
    components: "VolunteerPage, VolunteerDetail, WriteTestimonial, SeeBlogs, BlogPost",
    scope: "Blog catalog, testimonial forms, volunteer registration flow",
    complexity: "Medium",
    charge: 3500,
    tag: "fe",
  },
  {
    name: "Admin Dashboard Interface",
    components: "NewDashAdmin, PhotoDash, VideoDash, RescueDash, AwardDash",
    scope: "Data visualization for impact, management tables for records",
    complexity: "Complex",
    charge: 5000,
    tag: "admin",
  },
];

const BACKEND_ITEMS: LineItem[] = [
  {
    name: "Core Server & Auth System",
    components: "Admin login (JWT), role verification, route protection middleware",
    scope: "Secure routing for admin dashboards, general API health and error handling",
    complexity: "Medium",
    charge: 3000,
    tag: "be",
  },
  {
    name: "Media & Content APIs",
    components: "Photo, Video, Blogs, Category, Awards Controllers",
    scope: "Cloudinary/AWS S3 integration, CRUD logic for blogs and media files",
    complexity: "Complex",
    charge: 4500,
    tag: "be",
  },
  {
    name: "Rescue & Adoption Engine",
    components: "Adoption, Rescue Controllers & Models",
    scope: "Handling rescue submissions, adoption requests, status tracking updates",
    complexity: "Medium",
    charge: 3500,
    tag: "be",
  },
  {
    name: "Community Management APIs",
    components: "Volunteer, Testimonial, Impact, Messages Controllers",
    scope: "Volunteer applications, real-time message handling, and impact statistics",
    complexity: "Medium",
    charge: 3000,
    tag: "be",
  },
];

const TOTALS: TotalRow[] = [
  { label: "Frontend Subtotal", value: "₹16,000" },
  { label: "Backend Subtotal", value: "₹14,000" },
  { label: "Gross Total", value: "₹30,000" },
  { label: "Grand Total", value: "₹30,000", variant: "grand" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const Tag: React.FC<{ variant: TagVariant }> = ({ variant }) => (
  <span
    className={`inline-block font-bold px-1.5 py-0.5 rounded-sm mt-1 uppercase tracking-widest ${TAG_STYLES[variant]}`}
    style={{ fontSize: 9 }}
  >
    {TAG_LABELS[variant]}
  </span>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className='flex items-center gap-2 border-b-2 border-indigo-600 uppercase font-bold text-indigo-600 tracking-widest'
    style={{ fontSize: 10, paddingTop: 24, paddingBottom: 12 }}
  >
    <span className='w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0' />
    {children}
  </div>
);

const MetaItem: React.FC<{
  label: string;
  value: string;
  valueClass?: string;
}> = ({ label, value, valueClass = "text-white" }) => (
  <div>
    <span
      className='block text-gray-400 uppercase tracking-widest mb-1'
      style={{ fontSize: 10 }}
    >
      {label}
    </span>
    <span className={`text-sm ${valueClass}`}>{value}</span>
  </div>
);

const ItemRow: React.FC<{ item: LineItem }> = ({ item }) => (
  <tr className='hover:bg-gray-50 transition-colors duration-150'>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top'
      style={{ width: "36%" }}
    >
      <div className='font-bold text-sm text-gray-900 pr-2'>{item.name}</div>
      <div className='text-xs text-gray-400 mt-0.5 leading-relaxed hidden sm:block'>
        {item.components}
      </div>
      <div className='text-xs text-gray-400 mt-0.5 leading-relaxed sm:hidden'>
        {item.components.length > 50
          ? item.components.substring(0, 50) + "..."
          : item.components}
      </div>
      <Tag variant={item.tag} />
    </td>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top hidden sm:table-cell'
      style={{ width: "28%" }}
    >
      <div className='text-xs text-gray-400 leading-relaxed'>{item.scope}</div>
    </td>
    <td className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top text-center'>
      <span
        className={`inline-block font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs ${
          item.complexity === "Simple"
            ? "bg-green-100 text-green-800"
            : item.complexity === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        {item.complexity}
      </span>
    </td>
    <td
      className='py-2 sm:py-3 px-2 border-b border-gray-100 align-top text-right text-sm font-medium text-gray-900'
      style={{ fontFamily: "monospace" }}
    >
      ₹{item.charge.toLocaleString("en-IN")}
    </td>
  </tr>
);

const TABLE_HEADERS = ["Item", "Scope", "Complexity", "Amount"];

const TableSection: React.FC<{ title: string; items: LineItem[] }> = ({
  title,
  items,
}) => (
  <div className='px-4 sm:px-6 lg:px-12'>
    <SectionTitle>{title}</SectionTitle>
    <div className='overflow-x-auto -mx-4 sm:mx-0'>
      <table className='w-full border-collapse min-w-[600px]'>
        <thead>
          <tr>
            {TABLE_HEADERS.map((h, i) => (
              <th
                key={h}
                className={`font-bold text-gray-400 border-b border-gray-200 px-2 py-3 uppercase tracking-widest ${
                  i === 0 || i === 1
                    ? "text-left"
                    : i === 2
                      ? "text-center"
                      : "text-right"
                } ${i === 1 ? "hidden sm:table-cell" : ""}`}
                style={{ fontSize: 10 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Copy Function ──────────────────────────────────────────────────────────────

const formatBillForCopy = () => {
  let billText = `PRAPTI FOUNDATION - PROJECT ESTIMATE\n`;
  billText += `====================================\n\n`;

  // Frontend Section
  billText += `FRONTEND DEVELOPMENT\n`;
  billText += `-------------------\n`;
  FRONTEND_ITEMS.forEach((item) => {
    billText += `${item.name}\n`;
    billText += `  Components: ${item.components}\n`;
    billText += `  Scope: ${item.scope}\n`;
    billText += `  Complexity: ${item.complexity}\n`;
    billText += `  Charge: ₹${item.charge.toLocaleString("en-IN")}\n\n`;
  });

  // Backend Section
  billText += `BACKEND DEVELOPMENT\n`;
  billText += `------------------\n`;
  BACKEND_ITEMS.forEach((item) => {
    billText += `${item.name}\n`;
    billText += `  Components: ${item.components}\n`;
    billText += `  Scope: ${item.scope}\n`;
    billText += `  Complexity: ${item.complexity}\n`;
    billText += `  Charge: ₹${item.charge.toLocaleString("en-IN")}\n\n`;
  });

  // Totals
  billText += `TOTALS\n`;
  billText += `------\n`;
  TOTALS.forEach((row) => {
    billText += `${row.label}: ${row.value}\n`;
  });

  billText += `\nPayment Terms: 50% advance, 50% on completion\n`;
  billText += `Generated: ${new Date().toLocaleDateString("en-IN")}\n`;

  return billText;
};

// ─── Main Component ───────────────────────────────────────────────────────────

const NOTE_BOXES: NoteBox[] = [
  {
    title: "Payment Terms",
    highlight: true,
    content: (
      <p className='text-sm text-gray-600 leading-relaxed'>
        50% advance (₹15,000) before development start.
        <br />
        50% balance (₹15,000) upon final delivery.
        <br />
        Payment via Bank Transfer/UPI.
      </p>
    ),
  },
  {
    title: "What's Included",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Custom React + Node.js Web Application</li>
        <li>Admin Content Management System</li>
        <li>Initial Server Deployment Setup</li>
        <li>Image Processing / Web Optimization</li>
        <li>Free bug resolution for 30 days</li>
      </ul>
    ),
  },
  {
    title: "Not Included",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Domain name and monthly hosting fees</li>
        <li>Third-party API pricing (Emails, SMS)</li>
        <li>Major architectural changes post-approval</li>
        <li>Content creation / Manual data entry</li>
      </ul>
    ),
  },
  {
    title: "Support Scope",
    content: (
      <ul className='text-sm text-gray-600 list-disc pl-4 leading-loose'>
        <li>Email support during business hours</li>
        <li>On-demand feature additions (billed separately)</li>
      </ul>
    ),
  },
];

const BudgetedBillMemo: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyBill = async () => {
    const billText = formatBillForCopy();
    try {
      await navigator.clipboard.writeText(billText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy bill:", err);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div className='min-h-screen bg-indigo-50 flex justify-center items-start py-6 sm:py-8 lg:py-10 px-3 sm:px-5 lg:px-5'>
      <div className='w-full max-w-4xl bg-white shadow-2xl rounded-lg sm:rounded-xl overflow-hidden border border-gray-100'>
        {/* ── Header ── */}
        <div className='bg-indigo-950 text-white px-6 sm:px-8 lg:px-12 pt-6 sm:pt-8 lg:pt-9 pb-4 sm:pb-6 lg:pb-7 relative overflow-hidden'>
          <div
            className='absolute rounded-full pointer-events-none opacity-20'
            style={{
              right: -60,
              top: -60,
              width: 300,
              height: 300,
              border: "60px solid #4f46e5",
            }}
          />

          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start relative z-10 gap-4 sm:gap-0'>
            {/* Brand */}
            <div className='flex items-center gap-2 sm:gap-3'>
              <div
                className='w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0'
              >
                PF
              </div>
              <div>
                <h1
                  className='text-xl sm:text-2xl font-semibold tracking-wide text-white font-sans'
                >
                  Prapti Foundation
                </h1>
                <span
                  className='text-indigo-200 font-medium uppercase tracking-widest'
                  style={{ fontSize: "10px" }}
                >
                  NGO Web Platform Initiative
                </span>
              </div>
            </div>

            {/* Invoice label */}
            <div className='text-right sm:text-left'>
              <div
                className='text-white font-light mt-2 sm:mt-0'
                style={{
                  fontSize: "clamp(20px, 4vw, 32px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                Project Estimate
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div
             className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-10 mt-6 sm:mt-7 pt-4 sm:pt-6 relative z-10'
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <MetaItem label='Date' value={new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric'})} />
            <MetaItem label='Project Type' value='Full-Stack App' />
            <MetaItem label='Currency' value='INR (₹)' />
            <MetaItem
              label='Status'
              value='PROPOSAL'
              valueClass='text-indigo-400 font-bold'
            />
          </div>
        </div>

        {/* ── Parties ── */}
        <div
          className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-100 bg-gray-50'
          style={{ gridTemplateColumns: "1fr 1px 1fr" }}
        >
          <div className='pr-0 lg:pr-6'>
            <p
              className='text-indigo-600 uppercase font-semibold tracking-widest mb-2.5'
              style={{ fontSize: 10 }}
            >
              Developed By
            </p>
            <h3 className='text-base font-black mb-1.5 text-gray-900'>
              Himanku Borah & Ilish Hazarika
            </h3>
            <p className='text-sm text-gray-600 leading-7'>
              Full-Stack Developers
              <br />
              Golaghat, Assam, India
            </p>
          </div>
          <div className='hidden lg:block bg-gray-200' />
          <div className='pl-0 lg:pl-6'>
            <p
              className='text-indigo-600 uppercase font-semibold tracking-widest mb-2.5'
              style={{ fontSize: 10 }}
            >
              Prepared For
            </p>
            <h3 className='text-base font-black mb-1.5 text-gray-900'>
              Prapti Foundation
            </h3>
            <p className='text-sm text-gray-600 leading-7'>
              Animal Rescue & Social Welfare
              <br />
              Foundation Representative
            </p>
          </div>
        </div>

        {/* ── Line Item Tables ── */}
        <div className="py-2">
          <TableSection
            title='Frontend Development (React, Vite, TailwindCSS)'
            items={FRONTEND_ITEMS}
          />
          <div className='mt-4'>
            <TableSection
              title='Backend Development (Node.js, Express, MongoDB)'
              items={BACKEND_ITEMS}
            />
          </div>
        </div>

        {/* ── Totals ── */}
        <div className='flex justify-end px-12 pb-8 pt-4'>
          <div className='w-80 mt-2'>
            {TOTALS.map((row) =>
              row.variant === "grand" ? (
                <div
                  key={row.label}
                  className='flex justify-between items-center bg-indigo-950 text-white px-4 py-3.5 mt-3 rounded-md shadow-md'
                >
                  <span
                    className='font-black uppercase tracking-wide'
                    style={{ fontSize: 12 }}
                  >
                    {row.label}
                  </span>
                  <span
                    className='text-indigo-300 font-bold'
                    style={{
                      fontFamily: "monospace",
                      fontSize: 20,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ) : (
                <div
                  key={row.label}
                  className='flex justify-between items-center py-2 border-b border-gray-100 text-sm'
                >
                  <span className='text-gray-600 font-medium'>{row.label}</span>
                  <span
                    className={`font-semibold ${row.variant === "discount" ? "text-green-700" : "text-gray-900"}`}
                    style={{ fontFamily: "monospace" }}
                  >
                    {row.value}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className='bg-white px-4 sm:px-6 py-4 flex justify-center border-t border-b border-gray-100'>
          <button
            onClick={handleCopyBill}
            className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md'
          >
            {copied ? (
              <>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                Details Copied!
              </>
            ) : (
              <>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                </svg>
                Copy Estimate Details
              </>
            )}
          </button>
        </div>

        {/* ── Notes ── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-12 py-8 bg-gray-50'>
          {NOTE_BOXES.map((box: NoteBox) => (
            <div
              key={box.title}
              className={`bg-white p-4 sm:p-5 border-l-4 shadow-sm ${box.highlight ? "border-indigo-600" : "border-gray-300"}`}
            >
              <h4
                className='text-indigo-900 font-bold uppercase tracking-widest mb-3'
                style={{ fontSize: 10 }}
              >
                {box.title}
              </h4>
              {box.content}
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className='bg-indigo-950 text-indigo-400 px-4 sm:px-6 lg:px-12 py-5 flex flex-col sm:flex-row justify-between items-center text-xs gap-2 sm:gap-0'>
          <div className='text-center sm:text-left text-indigo-200'>
            Developed specifically for 
            <strong className='text-white font-medium ml-1'>Prapti Foundation</strong>
          </div>
          <div
            className='text-white font-mono uppercase tracking-widest text-center sm:text-right'
            style={{ fontSize: 11, opacity: 0.5 }}
          >
            CONFIDENTIAL ESTIMATE
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetedBillMemo;
