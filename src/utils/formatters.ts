/**
 * Utility functions for Frontier Solar CRM
 * Registered PM Surya Ghar Vendor, Nagpur, Maharashtra
 */

export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * PM Surya Ghar Muft Bijli Yojana Central Financial Assistance (Subsidy) Structure:
 * - Up to 1 kW: ₹30,000
 * - Up to 2 kW: ₹60,000
 * - 3 kW and above (residential max cap): ₹78,000
 */
export function calculatePmSuryaGharSubsidy(capacityKw: number): number {
  if (capacityKw <= 0) return 0;
  if (capacityKw < 2) return 30000;
  if (capacityKw < 3) return 60000;
  return 78000; // Cap at ₹78,000 for residential 3kW+
}

export function cleanPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return digits;
  return digits || '919876543210';
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function generateGoogleMapsLink(
  address: string,
  lat?: number,
  lng?: number
): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address + ', Nagpur, Maharashtra'
  )}`;
}

export function exportToCsv(filename: string, rows: Record<string, any>[]): void {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((fieldName) => {
          const val = row[fieldName] !== undefined ? String(row[fieldName]) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadJsonFile(filename: string, data: any): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Mask sensitive customer credentials as mandated by Requirement 45
 */
export function maskAadhaar(aadhaar: string | undefined): string {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXX-XXXX-XXXX';
  const last4 = clean.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function maskPan(pan: string | undefined): string {
  if (!pan) return 'XXXXX0000X';
  const clean = pan.trim().toUpperCase();
  if (clean.length < 5) return 'XXXXX0000X';
  return `XXXXX${clean.slice(5)}`;
}

export function maskBankAccount(acc: string | undefined): string {
  if (!acc) return 'XXXXXXXX0000';
  const clean = acc.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXXXXXX0000';
  const last4 = clean.slice(-4);
  return `XXXXXX${last4}`;
}

export function maskPhone(phone: string | undefined): string {
  if (!phone) return '98XXXXXXXX';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 6) return '98XXXXXXXX';
  return `${clean.slice(0, 2)}XXXX${clean.slice(-4)}`;
}

export function numberToIndianWords(num: number | undefined | null): string {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(num);
  if (n.toString().length > 9) return `Rupees ${n.toLocaleString('en-IN')} Only`;

  const formatBelowThousand = (val: number): string => {
    let str = '';
    if (val > 99) {
      str += `${a[Math.floor(val / 100)]} Hundred `;
      val %= 100;
    }
    if (val > 19) {
      str += `${b[Math.floor(val / 10)]} `;
      val %= 10;
    }
    if (val > 0) {
      str += `${a[val]} `;
    }
    return str.trim();
  };

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const remainder = n % 1000;

  let result = 'Rupees ';
  if (crore > 0) result += `${formatBelowThousand(crore)} Crore `;
  if (lakh > 0) result += `${formatBelowThousand(lakh)} Lakh `;
  if (thousand > 0) result += `${formatBelowThousand(thousand)} Thousand `;
  if (remainder > 0) result += `${formatBelowThousand(remainder)} `;

  return `${result.trim()} Only`;
}

