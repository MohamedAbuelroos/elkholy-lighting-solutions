export const receiptStyles = `
  .kh-receipt {
    direction: rtl;
    color: #171717;
    background: #fff;
    font-family: Arial, Tahoma, sans-serif;
    padding: 28px;
    text-align: right;
    line-height: 1.8;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .kh-receipt * { box-sizing: border-box; }
  .kh-receipt h2, .kh-receipt h3, .kh-receipt p { margin: 0; }

  .kh-receipt .kh-header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    padding-bottom: 20px;
    border-bottom: 2px solid #b58b32;
  }

  .kh-receipt .kh-brand {
    color: #8a651e;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 3px;
  }

  .kh-receipt h2 { font-size: 22px; }
  .kh-receipt h3 { margin-bottom: 10px; font-size: 15px; }
  .kh-receipt .kh-muted { color: #616161; font-size: 11px; }

  .kh-receipt .kh-details {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin: 22px 0;
  }

  .kh-receipt .kh-box {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
  }

  .kh-receipt .kh-table-scroll { overflow-x: auto; }

  .kh-receipt table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }

  .kh-receipt th, .kh-receipt td {
    padding: 10px 7px;
    border-bottom: 1px solid #ddd;
    text-align: right;
    vertical-align: top;
  }

  .kh-receipt thead { background: #f3efe5; }
  .kh-receipt thead th { font-weight: bold; }
  .kh-receipt tbody tr { break-inside: avoid; }

  .kh-receipt .kh-summary {
    margin-top: 22px;
    border-top: 2px solid #b58b32;
    padding-top: 15px;
  }

  .kh-receipt .kh-summary p {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 7px;
  }

  .kh-receipt .kh-total { font-size: 18px; font-weight: bold; }
  .kh-receipt .kh-notes { white-space: pre-wrap; margin-top: 18px; }
  .kh-receipt .kh-tracking { margin-top: 20px; break-inside: avoid; }
  .kh-receipt .kh-code { font-family: monospace; font-weight: bold; }
  .kh-receipt .kh-footer {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
    font-size: 11px;
    color: #555;
  }

  @media screen and (max-width: 600px) {
    .kh-receipt { padding: 16px; }
    .kh-receipt .kh-details { grid-template-columns: 1fr; }
    .kh-receipt table { min-width: 620px; }
  }

  @page { size: A4; margin: 12mm; }

  @media print {
    html, body { margin: 0; padding: 0; background: white; }
    .kh-receipt { padding: 0; }
    .kh-receipt .kh-table-scroll { overflow: visible; }
    .kh-receipt table { min-width: 0; table-layout: fixed; }
    .kh-receipt thead { display: table-header-group; }
    .kh-receipt th:first-child { width: 28%; }
  }
`;

export async function printOrderReceipt(
  element: HTMLElement,
  orderNumber: string,
): Promise<void> {
  // Open synchronously from the click to avoid popup blockers.
  const printWindow = window.open("", "_blank", "width=1000,height=800");

  if (!printWindow) {
    throw new Error("Print window was blocked.");
  }

  try {
    printWindow.opener = null;

    const document = printWindow.document;

    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    document.title = `Elkholy-Order-KH-${orderNumber}`;

    const charset = document.createElement("meta");
    charset.setAttribute("charset", "utf-8");

    const style = document.createElement("style");
    style.textContent = receiptStyles;

    document.head.append(charset, style);
    document.body.replaceChildren(document.importNode(element, true));

    await document.fonts.ready;

    if (printWindow.closed) return;

    printWindow.focus();
    printWindow.print();
  } catch {
    if (!printWindow.closed) printWindow.close();
    throw new Error("Receipt printing failed.");
  }
}
