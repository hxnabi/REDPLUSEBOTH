import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using the configured SMTP server.
    """
    # If credentials are not set, just log the email
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        logger.warning(f"Email credentials not configured. Mocking email to {to_email}")
        print(f"--- MOCK EMAIL ---\nTo: {to_email}\nSubject: {subject}\nBody:\n{body}\n------------------")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(settings.EMAIL_FROM, to_email, text)
        server.quit()
        logger.info(f"Email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")

def send_blood_request_confirmation(to_email: str, patient_name: str, request_id: int):
    """
    Helper to send blood request confirmation email.
    """
    subject = f"Blood Request Received - Tracking ID: {request_id}"
    
    # Modern, responsive HTML email template
    body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blood Request Confirmation</title>
        <style>
            body {{
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f9fafb;
                color: #333333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                margin-top: 40px;
                margin-bottom: 40px;
            }}
            .header {{
                background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }}
            .content {{
                padding: 40px 30px;
                text-align: left;
            }}
            .greeting {{
                font-size: 18px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 20px;
            }}
            .message {{
                font-size: 16px;
                line-height: 1.6;
                color: #4b5563;
                margin-bottom: 30px;
            }}
            .card {{
                background-color: #fef2f2;
                border: 1px solid #fee2e2;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                text-align: center;
            }}
            .card-label {{
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #991b1b;
                margin-bottom: 8px;
                font-weight: 600;
            }}
            .card-value {{
                font-size: 32px;
                font-weight: 800;
                color: #ef4444;
                font-family: monospace;
                letter-spacing: 2px;
            }}
            .patient-info {{
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 25px;
                font-size: 15px;
                color: #374151;
            }}
            .footer {{
                background-color: #f9fafb;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
            }}
            .button {{
                display: inline-block;
                background-color: #ef4444;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 600;
                margin-top: 10px;
            }}
            .button:hover {{
                background-color: #dc2626;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>RedConnect</h1>
            </div>
            <div class="content">
                <div class="greeting">Hello,</div>
                <div class="message">
                    We have successfully received your blood request. Our team is verifying the details and will notify potential donors in your area immediately.
                </div>
                
                <div class="card">
                    <div class="card-label">Your Request ID</div>
                    <div class="card-value">#{request_id}</div>
                </div>

                <div class="patient-info">
                    <strong>Patient Name:</strong> {patient_name}
                </div>

                <div class="message">
                    You can use this ID to track the real-time status of your request on our website.
                </div>

                <div style="text-align: center;">
                    <a href="http://localhost:5173/blood-request/track/{request_id}" class="button">Track Request Status</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2025 RedConnect. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    send_email(to_email, subject, body)
