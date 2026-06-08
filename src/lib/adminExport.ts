type ExportRow = Record<string, unknown>;

const EXPORT_LABELS: Record<string, string> = {
  full_name: "Full Name",
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  subject: "Subject",
  message: "Message",
  product_interest: "Product Interest",
  linkedin: "LinkedIn",
  resume_url: "Resume URL",
  preferred_pathway: "Pathway",
  certifications: "Certifications",
  certification_links: "Cert Links",
  relevant_experience: "Experience",
  motivation: "Motivation",
  portfolio: "Portfolio",
  status: "Status",
  created_at: "Submitted",
  reviewed_at: "Reviewed",
  contacted_at: "Contacted",
  shortlisted_at: "Shortlisted",
  rejected_at: "Rejected At",
  id: "ID",
};

const formatCell = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getExportKeys = (rows: ExportRow[]): string[] => {
  if (rows.length === 0) return [];
  const preferred = [
    "full_name", "name", "email", "phone", "company", "subject",
    "product_interest", "linkedin", "preferred_pathway", "resume_url",
    "certifications", "certification_links", "relevant_experience",
    "motivation", "portfolio", "message", "status",
    "created_at", "reviewed_at", "contacted_at", "shortlisted_at", "rejected_at", "id",
  ];
  const keys = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((k) => keys.add(k)));
  return [
    ...preferred.filter((k) => keys.has(k)),
    ...[...keys].filter((k) => !preferred.includes(k)),
  ];
};

const downloadBlob = (content: BlobPart, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCsv = (rows: ExportRow[], filename: string) => {
  const keys = getExportKeys(rows);
  const headers = keys.map((k) => EXPORT_LABELS[k] ?? k);
  const esc = (v: unknown) => `"${formatCell(v).replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((row) => keys.map((k) => esc(row[k])).join(",")),
  ].join("\n");
  downloadBlob(csv, filename, "text/csv;charset=utf-8");
};

export const exportToExcel = async (rows: ExportRow[], filename: string) => {
  const XLSX = await import("xlsx");
  const keys = getExportKeys(rows);
  const headers = keys.map((k) => EXPORT_LABELS[k] ?? k);
  const data = rows.map((row) =>
    Object.fromEntries(keys.map((k, i) => [headers[i], formatCell(row[k])])),
  );
  const sheet = XLSX.utils.json_to_sheet(data);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Submissions");
  XLSX.writeFile(book, filename);
};

const loadLogoDataUrl = async (logoUrl: string): Promise<string | null> => {
  try {
    const res = await fetch(logoUrl);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const exportToPdf = async (
  rows: ExportRow[],
  filename: string,
  options: { title: string; logoUrl: string },
) => {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const keys = getExportKeys(rows);
  const headers = keys.map((k) => EXPORT_LABELS[k] ?? k);
  const body = rows.map((row) => keys.map((k) => formatCell(row[k])));

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const exportDate = new Date().toLocaleString();

  const logoData = await loadLogoDataUrl(options.logoUrl);
  if (logoData) {
    doc.addImage(logoData, "JPEG", 40, 28, 36, 36);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("ClickBox Admin Export", logoData ? 86 : 40, 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(options.title, logoData ? 86 : 40, 62);
  doc.text(`Exported: ${exportDate}`, pageWidth - 40, 46, { align: "right" });
  doc.text(`${rows.length} record${rows.length === 1 ? "" : "s"}`, pageWidth - 40, 62, {
    align: "right",
  });

  autoTable(doc, {
    startY: 82,
    head: [headers],
    body,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak",
      valign: "top",
    },
    headStyles: {
      fillColor: [45, 55, 72],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `ClickBox — Confidential · Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" },
      );
    },
  });

  doc.save(filename);
};

export type ExportFormat = "csv" | "excel" | "pdf";

export const runExport = async (
  format: ExportFormat,
  rows: ExportRow[],
  baseFilename: string,
  meta: { title: string; logoUrl: string },
) => {
  const date = new Date().toISOString().slice(0, 10);
  const stem = `${baseFilename}-${date}`;

  if (format === "csv") {
    exportToCsv(rows, `${stem}.csv`);
    return;
  }
  if (format === "excel") {
    await exportToExcel(rows, `${stem}.xlsx`);
    return;
  }
  await exportToPdf(rows, `${stem}.pdf`, meta);
};
