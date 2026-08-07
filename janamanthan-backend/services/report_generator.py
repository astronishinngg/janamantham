import datetime
from pathlib import Path
from typing import Dict, Any, List
from config import REPORTS_DIR
from schemas.report import GovernanceReport, ExecutiveSummary, CategoryStat, LocationStat, ClusterStat, RootCauseStat, PriorityAction, ChartsData
from utils.logger import logger

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

class ReportGeneratorService:
    @staticmethod
    def build_json_report(upload_id: str, filename: str, stats: Dict[str, Any], clusters: List[ClusterStat], ai_insights: Dict[str, Any]) -> GovernanceReport:
        """Assembles complete GovernanceReport object."""
        report = GovernanceReport(
            upload_id=upload_id,
            generated_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            total_complaints=stats["total"],
            dataset_name=filename,
            executive_summary=ai_insights["executive_summary"],
            category_stats=stats["category_stats"],
            top_locations=stats["top_locations"],
            clusters=clusters,
            root_causes=ai_insights["root_causes"],
            priority_actions=ai_insights["priority_actions"],
            charts_data=stats["charts_data"],
            pdf_available=True
        )
        return report

    @staticmethod
    def generate_pdf_report(report: GovernanceReport) -> Path:
        """Generates a professional multi-page PDF report using ReportLab."""
        pdf_path = REPORTS_DIR / f"{report.upload_id}_report.pdf"
        
        doc = SimpleDocTemplate(
            str(pdf_path),
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        
        styles = getSampleStyleSheet()
        
        # Custom color palette matching JanaManthan design
        c_primary = colors.HexColor("#0f2b48")    # Deep Navy
        c_secondary = colors.HexColor("#e65100")  # Saffron / Orange
        c_accent = colors.HexColor("#2e7d32")     # Emerald Green
        c_dark = colors.HexColor("#212121")       # Charcoal
        c_light_bg = colors.HexColor("#f5f7fa")   # Light Grey
        
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=c_primary,
            alignment=TA_LEFT
        )
        
        subtitle_style = ParagraphStyle(
            'DocSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=14,
            textColor=c_secondary,
            alignment=TA_LEFT
        )
        
        h2_style = ParagraphStyle(
            'Heading2Custom',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=18,
            textColor=c_primary,
            spaceBefore=12,
            spaceAfter=6
        )
        
        body_style = ParagraphStyle(
            'BodyCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=c_dark,
            alignment=TA_LEFT
        )
        
        bullet_style = ParagraphStyle(
            'BulletCustom',
            parent=body_style,
            leftIndent=15,
            bulletIndent=5,
            spaceAfter=4
        )
        
        elements = []
        
        # 1. Header Banner
        elements.append(Paragraph("JanaManthan — Governance Intelligence Report", title_style))
        elements.append(Paragraph("Transforming Citizen Grievance Data into Actionable Policy Intelligence", subtitle_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=2, color=c_secondary, spaceAfter=12))
        
        # 2. Metadata KPI Table
        meta_data = [
            [
                Paragraph(f"<b>Upload ID:</b> {report.upload_id}", body_style),
                Paragraph(f"<b>Dataset:</b> {report.dataset_name}", body_style),
            ],
            [
                Paragraph(f"<b>Total Complaints Analyzed:</b> {report.total_complaints}", body_style),
                Paragraph(f"<b>Generated At:</b> {report.generated_at}", body_style),
            ]
        ]
        meta_table = Table(meta_data, colWidths=[270, 270])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_light_bg),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 15))
        
        # 3. Executive Summary
        elements.append(Paragraph("1. Executive Summary", h2_style))
        elements.append(Paragraph(report.executive_summary.overview, body_style))
        elements.append(Spacer(1, 8))
        
        elements.append(Paragraph("<b>Key Governance Findings:</b>", body_style))
        for finding in report.executive_summary.key_findings:
            elements.append(Paragraph(f"• {finding}", bullet_style))
            
        elements.append(Spacer(1, 6))
        elements.append(Paragraph(f"<b>Strategic Policy Insight:</b> {report.executive_summary.governance_insights}", body_style))
        elements.append(Spacer(1, 15))
        
        # 4. Department & Category Breakdown
        elements.append(Paragraph("2. Grievances Breakdown by Department", h2_style))
        cat_table_data = [["Department / Sector", "Count", "Volume %", "Avg Resolution Days"]]
        for cat in report.category_stats:
            cat_table_data.append([
                cat.category,
                str(cat.count),
                f"{cat.percentage}%",
                f"{cat.avg_resolution_days} days" if cat.avg_resolution_days else "N/A"
            ])
            
        cat_table = Table(cat_table_data, colWidths=[200, 90, 110, 140])
        cat_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), c_primary),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light_bg]),
            ('PADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(cat_table)
        elements.append(Spacer(1, 15))
        
        # 5. Issue Clusters & Root Causes
        if report.clusters:
            elements.append(Paragraph("3. Recurring Issue Clusters & Root Causes", h2_style))
            for cl in report.clusters[:3]:
                cluster_box = [
                    [Paragraph(f"<b>Cluster #{cl.cluster_id + 1}: {cl.topic_title}</b> ({cl.category})", ParagraphStyle('ClHeader', parent=body_style, fontName='Helvetica-Bold', textColor=c_primary))],
                    [Paragraph(f"<b>Recurrence Volume:</b> {cl.complaint_count} complaints ({cl.recurrence_percentage}% of total dataset)", body_style)],
                    [Paragraph(f"<b>Root Cause:</b> {cl.detected_root_cause}", body_style)],
                ]
                cl_table = Table(cluster_box, colWidths=[540])
                cl_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), c_light_bg),
                    ('BOX', (0, 0), (-1, -1), 1, c_secondary),
                    ('PADDING', (0, 0), (-1, -1), 8),
                ]))
                elements.append(cl_table)
                elements.append(Spacer(1, 8))
                
        # 6. Priority Policy Actions
        if report.priority_actions:
            elements.append(Spacer(1, 10))
            elements.append(Paragraph("4. Recommended Priority Policy Actions", h2_style))
            pa_table_data = [["Priority", "Department", "Recommended Action", "Expected Impact"]]
            for pa in report.priority_actions:
                pa_table_data.append([
                    f"P{pa.priority}",
                    pa.department,
                    Paragraph(pa.recommended_action, body_style),
                    Paragraph(pa.impact, body_style)
                ])
                
            pa_table = Table(pa_table_data, colWidths=[50, 110, 240, 140])
            pa_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), c_accent),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('ALIGN', (0, 0), (0, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('PADDING', (0, 0), (-1, -1), 6),
            ]))
            elements.append(pa_table)
            
        doc.build(elements)
        logger.info(f"Generated PDF Report successfully at {pdf_path}")
        return pdf_path
