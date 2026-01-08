"""
Certificate generation utilities for blood donation certificates.
"""
from datetime import datetime
from typing import Dict

def generate_certificate_html(certificate_data: Dict) -> str:
    """Generate HTML certificate with proper formatting."""
    
    html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blood Donation Certificate</title>
    <style>
        @page {{
            size: A4;
            margin: 0;
        }}
        
        body {{
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
            background: white;
        }}
        
        .certificate {{
            width: 210mm;
            height: 297mm;
            padding: 40px 60px;
            box-sizing: border-box;
            position: relative;
            background: linear-gradient(to bottom, #ffffff 0%, #fff5f5 100%);
        }}
        
        .border {{
            border: 8px double #C8102E;
            padding: 30px;
            height: 100%;
            box-sizing: border-box;
            position: relative;
        }}
        
        .inner-border {{
            border: 2px solid #C8102E;
            padding: 40px;
            height: 100%;
            box-sizing: border-box;
        }}
        
        .header {{
            text-align: center;
            margin-bottom: 30px;
        }}
        
        .logo {{
            width: 80px;
            height: 80px;
            margin: 0 auto 15px;
            background: #C8102E;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 36px;
            font-weight: bold;
        }}
        
        .title {{
            font-size: 42px;
            color: #C8102E;
            font-weight: bold;
            margin: 10px 0;
            text-transform: uppercase;
            letter-spacing: 3px;
        }}
        
        .subtitle {{
            font-size: 20px;
            color: #666;
            font-style: italic;
            margin: 5px 0;
        }}
        
        .certificate-body {{
            text-align: center;
            margin: 40px 0;
        }}
        
        .proudly-text {{
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }}
        
        .recipient-name {{
            font-size: 48px;
            color: #C8102E;
            font-weight: bold;
            margin: 20px 0;
            padding: 10px 0;
            border-bottom: 3px solid #C8102E;
            display: inline-block;
            min-width: 400px;
        }}
        
        .description {{
            font-size: 18px;
            color: #333;
            line-height: 1.8;
            margin: 30px auto;
            max-width: 600px;
        }}
        
        .details-box {{
            display: flex;
            justify-content: space-around;
            margin: 40px 0;
            padding: 20px;
            background: rgba(200, 16, 46, 0.05);
            border-radius: 10px;
        }}
        
        .detail-item {{
            text-align: center;
        }}
        
        .detail-label {{
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }}
        
        .detail-value {{
            font-size: 20px;
            color: #C8102E;
            font-weight: bold;
        }}
        
        .footer {{
            position: absolute;
            bottom: 40px;
            left: 60px;
            right: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }}
        
        .signature-box {{
            text-align: center;
            width: 200px;
        }}
        
        .signature-line {{
            border-top: 2px solid #333;
            padding-top: 10px;
            margin-top: 40px;
        }}
        
        .signature-label {{
            font-size: 14px;
            color: #666;
        }}
        
        .certificate-number {{
            font-size: 12px;
            color: #999;
            text-align: center;
            margin-top: 10px;
        }}
        
        .watermark {{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(200, 16, 46, 0.05);
            font-weight: bold;
            pointer-events: none;
            z-index: 0;
        }}
        
        @media print {{
            body {{
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }}
        }}
    </style>
</head>
<body>
    <div class="certificate">
        <div class="border">
            <div class="inner-border">
                <div class="watermark">RED+</div>
                
                <div class="header">
                    <div class="logo">🩸</div>
                    <div class="title">Certificate of Appreciation</div>
                    <div class="subtitle">Blood Donation Recognition</div>
                </div>
                
                <div class="certificate-body">
                    <p class="proudly-text">This is to certify that</p>
                    
                    <div class="recipient-name">{certificate_data['donor_name']}</div>
                    
                    <p class="description">
                        has generously donated <strong>{certificate_data['blood_units']} unit(s)</strong> of 
                        <strong>{certificate_data['blood_type']}</strong> blood on 
                        <strong>{certificate_data['donation_date']}</strong>.
                        This selfless act of kindness will help save precious lives and 
                        is deeply appreciated by our community.
                    </p>
                    
                    <div class="details-box">
                        <div class="detail-item">
                            <div class="detail-label">Blood Type</div>
                            <div class="detail-value">{certificate_data['blood_type']}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Units Donated</div>
                            <div class="detail-value">{certificate_data['blood_units']}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Issue Date</div>
                            <div class="detail-value">{certificate_data['issue_date']}</div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="signature-box">
                        <div class="signature-line">
                            <div class="signature-label">{certificate_data['issued_by']}</div>
                            <div style="font-size: 12px; color: #999; margin-top: 5px;">Issuing Organization</div>
                        </div>
                    </div>
                    
                    <div class="signature-box">
                        <div class="signature-line">
                            <div class="signature-label">Authorized Signature</div>
                            <div style="font-size: 12px; color: #999; margin-top: 5px;">Medical Officer</div>
                        </div>
                    </div>
                </div>
                
                <div class="certificate-number">
                    Certificate No: {certificate_data['certificate_number']}<br>
                    Verified & Issued by {certificate_data['issued_by']}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    """
    
    return html_template
