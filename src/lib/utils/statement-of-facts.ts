// src/lib/utils/statement-of-facts.ts
import { format } from 'date-fns';
import type { ShipmentData } from '@/types/import/workflow';
import html2pdf from 'html2pdf.js';

const createSOFHTML = (data: ShipmentData) => {
  const events = data.statementOfFacts.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; color: #333;">Statement of Facts</h1>
        <p style="margin: 10px 0; color: #666;">Reference No: ${data.referenceNumber}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Shipment Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; width: 30%;"><strong>Consignee:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.consignee?.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>BL/AWB Number:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${
              data.shipmentDetails.bl_number || data.shipmentDetails.flight_number
            }</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Port of Origin:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.shipmentDetails.port_of_origin}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Port of Discharge:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.shipmentDetails.port_of_discharge}</td>
          </tr>
        </table>
      </div>

      <div>
        <h2 style="font-size: 18px; margin-bottom: 10px;">Timeline of Events</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Date & Time</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Event Description</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Created By</th>
            </tr>
          </thead>
          <tbody>
            ${events.map(event => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  ${format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">${event.description}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${event.createdBy.name}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 40px;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Generated on ${format(new Date(), 'MMMM dd, yyyy HH:mm')}
        </p>
      </div>
    </div>
  `;
};

export const generateSOFPDF = async (data: ShipmentData) => {
  const element = createSOFHTML(data);
  const opt = {
    margin: 1,
    filename: `SOF-${data.referenceNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().from(element).set(opt).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};