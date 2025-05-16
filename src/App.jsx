import { useState } from 'react';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [businessName, setBusinessName] = useState('SUPER POWER');
  const [contactPerson, setContactPerson] = useState('Siva');
  const [phoneNumber, setPhoneNumber] = useState('+918089786704');
  const [invoiceNumber, setInvoiceNumber] = useState('#84-SUP-2025');
  const [customerName, setCustomerName] = useState('Adharsh.A');
  const [customerPhone, setCustomerPhone] = useState('+91 - 7736123615');
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('3');
  const [invoiceDate] = useState(new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }));

  const [errors, setErrors] = useState({});

  const plans = [
    { months: 1, label: '1 month', price: 1500 },
    { months: 3, label: '3 months', price: 3000 },
    { months: 6, label: '6 months', price: 7500 },
    { months: 12, label: '12 months', price: 15000 }
  ];

  const calculateEndDate = (startDate, months) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {};
    const rawPhone = phoneNumber.replace(/\D/g, '');
    
    if (rawPhone.length < 10) {
      newErrors.phoneNumber = 'Phone number must contain at least 10 digits.';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      generatePDF();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const sectionGap = 10;

    // Set font styles
    doc.setFont('helvetica');
    
    // Header Section
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(businessName.toUpperCase(), 15, yPos);
    yPos += lineHeight;
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(contactPerson, 15, yPos);
    yPos += lineHeight;
    
    doc.text(`Contact: ${phoneNumber}`, 15, yPos);
    yPos += lineHeight * 2;
    
    // Invoice Title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("INVOICE", 105, yPos, { align: 'center' });
    yPos += lineHeight;
    
    doc.setFont(undefined, 'normal');
    doc.text(invoiceNumber, 105, yPos, { align: 'center' });
    yPos += sectionGap;
    
    // Horizontal line
    doc.line(15, yPos, 195, yPos);
    yPos += sectionGap;
    
    // Billed To Section
    doc.setFont(undefined, 'bold');
    doc.text("Billed To", 15, yPos);
    yPos += lineHeight;
    
    doc.setFont(undefined, 'normal');
    doc.text(customerName, 15, yPos);
    yPos += lineHeight;
    
    doc.text(customerPhone, 15, yPos);
    yPos += lineHeight * 1.5;
    
    doc.setFont(undefined, 'bold');
    doc.text("Invoice Date", 130, yPos - (lineHeight * 1.5));
    doc.setFont(undefined, 'normal');
    doc.text(invoiceDate, 130, yPos - (lineHeight * 0.5));
    
    // Horizontal line
    doc.line(15, yPos, 195, yPos);
    yPos += sectionGap;
    
    // Plan Details Section
    doc.setFont(undefined, 'bold');
    doc.text("PLAN DETAILS", 15, yPos);
    yPos += lineHeight * 1.5;
    
    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 3, 180, lineHeight + 3, 'F');
    doc.setFont(undefined, 'bold');
    doc.text("Plan", 20, yPos);
    doc.text("Start Date", 70, yPos);
    doc.text("End Date", 120, yPos);
    doc.text("Amount", 170, yPos, { align: 'right' });
    yPos += lineHeight;
    
    // Table Row
    const selectedPlanObj = plans.find(p => p.months.toString() === selectedPlan);
    const startDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const endDate = calculateEndDate(new Date(), selectedPlanObj.months);
    
    doc.setFont(undefined, 'normal');
    doc.text(selectedPlanObj.label, 20, yPos);
    doc.text(startDate, 70, yPos);
    doc.text(endDate, 120, yPos);
    doc.text(`₹${selectedPlanObj.price.toLocaleString('en-IN')}`, 170, yPos, { align: 'right' });
    yPos += lineHeight;
    
    // Horizontal line
    doc.line(15, yPos, 195, yPos);
    yPos += sectionGap;
    
    // Add logo if exists (fixed dimensions to prevent stretching)
    if (previewUrl) {
      try {
        doc.addImage(previewUrl, 'JPEG', 150, 10, 40, 20); // Fixed aspect ratio
      } catch (error) {
        console.error("Error adding image:", error);
      }
    }
    
    doc.save(`${businessName.replace(/\s+/g, '_')}_Invoice_${invoiceNumber.replace('#', '')}.pdf`);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert('File too large. Max size is 2MB.');
    }
  };

  return (
    <div className="container">
      <h1>PaperTrail</h1>

      <form id="receipt-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="business-name">Business Name:</label>
          <input
            type="text"
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-person">Contact Person:</label>
          <input
            type="text"
            id="contact-person"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone-number">Phone Number:</label>
          <input
            type="tel"
            id="phone-number"
            placeholder="e.g. +918089786704"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {errors.phoneNumber && (
            <p className="error-text">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="invoice-number">Invoice Number:</label>
          <input
            type="text"
            id="invoice-number"
            placeholder="e.g. #84-SUP-2025"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-name">Customer Name:</label>
          <input
            type="text"
            id="customer-name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="customer-phone">Customer Phone:</label>
          <input
            type="tel"
            id="customer-phone"
            placeholder="e.g. +91 - 7736123615"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="plan-select">Select Plan:</label>
          <select
            id="plan-select"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            {plans.map(plan => (
              <option key={plan.months} value={plan.months}>
                {plan.label} (₹{plan.price.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="logo-upload">Business Logo:</label>
          <div className="file-upload">
            <label htmlFor="logo-upload" className="file-upload-label">
              Choose File
            </label>
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </div>
          <p className="help-text">Recommended size: 300x150 pixels, Max size: 2MB</p>

          {previewUrl && (
            <div className="logo-preview">
              <img src={previewUrl} alt="Logo preview" style={{ maxWidth: '200px', maxHeight: '100px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="btn">Generate Invoice</button>
      </form>
    </div>
  );
}

export default App;