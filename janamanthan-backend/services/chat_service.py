import json
from pathlib import Path
from typing import Optional
from config import REPORTS_DIR, LOCAL_LLM_URL

class ChatService:
    @staticmethod
    def get_response(message: str, upload_id: Optional[str] = None) -> str:
        msg = message.lower().strip()
        
        # Check if the user is asking about statistics/results
        stats_keywords = ["summary", "complaint", "district", "department", "trend", "priority", "issue", "cluster", "stat"]
        is_asking_stats = any(k in msg for k in stats_keywords)
        
        # Load report data if upload_id is provided
        report_data = None
        if upload_id:
            report_path = REPORTS_DIR / f"{upload_id}_report.json"
            if report_path.exists():
                try:
                    with open(report_path, "r", encoding="utf-8") as f:
                        report_data = json.load(f)
                except Exception as e:
                    print(f"Error loading report {upload_id}: {e}")
        
        # Fallback: if no report is loaded, find the most recently modified report in REPORTS_DIR
        if not report_data:
            try:
                report_files = list(REPORTS_DIR.glob("*_report.json"))
                if report_files:
                    latest_report = max(report_files, key=lambda p: p.stat().st_mtime)
                    with open(latest_report, "r", encoding="utf-8") as f:
                        report_data = json.load(f)
                    print(f"Auto-fallback loaded latest report: {latest_report.name}")
            except Exception as e:
                print(f"Error loading latest fallback report: {e}")
        
        # If user asks for statistics but no report could be loaded at all
        if is_asking_stats and not report_data:
            return (
                "I see you are asking about analysis statistics, but no active dataset has been analyzed yet. "
                "Please upload a dataset and run the Manthan Engine first to let me access this information."
            )
            
        # Attempt to run via Local LLM (LM Studio)
        if LOCAL_LLM_URL:
            try:
                from openai import OpenAI
                client = OpenAI(base_url=LOCAL_LLM_URL, api_key="lm-studio", timeout=1.0)
                
                # Format context string from report if available
                context = "No active report dataset loaded."
                if report_data:
                    context = (
                        f"Dataset Name: {report_data.get('dataset_name', 'Unknown')}\n"
                        f"Total Complaints: {report_data.get('total_complaints', 0)}\n"
                        f"Executive Summary Overview: {report_data.get('executive_summary', {}).get('overview', '')}\n"
                        f"Key Findings: {', '.join(report_data.get('executive_summary', {}).get('key_findings', []))}\n"
                        f"Top Categories: {[{c.get('category'): c.get('count')} for c in report_data.get('category_stats', [])[:5]]}\n"
                        f"Clusters: {[{cl.get('topic_title'): cl.get('complaint_count')} for cl in report_data.get('clusters', [])]}\n"
                        f"Priority Actions: {[{pa.get('priority'): pa.get('title')} for pa in report_data.get('priority_actions', [])]}\n"
                    )
                
                system_prompt = (
                    "You are JanaManthan Assistant, an AI companion for government grievance analysis. "
                    "Your task is to answer user questions using only the provided analysis context. "
                    "Do not invent any numbers, percentages, or statistics. "
                    "If the information is not in the context, clearly explain that you do not have that data."
                )
                
                user_content = (
                    f"Context:\n{context}\n\n"
                    f"User Question: {message}\n\n"
                    f"Answer:"
                )
                
                chat_completion = client.chat.completions.create(
                    model="local-model",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content}
                    ],
                    temperature=0.2,
                    max_tokens=256
                )
                
                response_text = chat_completion.choices[0].message.content
                if response_text and response_text.strip():
                    return response_text.strip()
            except Exception as e:
                print(f"Local LLM not active or failed: {e}. Falling back to rule-based response.")

        # Fallback Deterministic Responses
        return ChatService.get_deterministic_response(msg, report_data)

    @staticmethod
    def get_deterministic_response(msg: str, report_data: Optional[dict]) -> str:
        # 1. Overall Summary
        if report_data and any(k in msg for k in ["summary", "overview"]):
            summary = report_data.get("executive_summary", {})
            overview = summary.get("overview", "No summary overview available.")
            findings = "\n".join([f"- {f}" for f in summary.get("key_findings", [])])
            return (
                f"**Analysis Summary for {report_data.get('dataset_name', 'Dataset')}**:\n\n"
                f"{overview}\n\n"
                f"**Key Findings**:\n{findings}"
            )
            
        # 2. Top Complaints / Category stats
        elif report_data and any(k in msg for k in ["top complaint", "most common", "frequent complaint", "top categories"]):
            categories = report_data.get("category_stats", [])
            if not categories:
                return "No category statistics available in this report."
            lines = ["**Top Grievance Categories**:\n"]
            for i, cat in enumerate(categories[:5]):
                lines.append(f"{i+1}. **{cat.get('category')}**: {cat.get('count')} cases ({cat.get('percentage')}%) — Avg resolution: {cat.get('avg_resolution_days')} days")
            return "\n".join(lines)
            
        # 3. District / Location Statistics
        elif report_data and any(k in msg for k in ["district", "location", "hotspot", "place", "city"]):
            charts = report_data.get("charts_data", {})
            locations = charts.get("locations_breakdown", {})
            if not locations:
                return "No district/location breakdown is available for this dataset."
            sorted_locs = sorted(locations.items(), key=lambda x: x[1], reverse=True)
            lines = ["**Top Impacted Districts / Cities**:\n"]
            for i, (loc, count) in enumerate(sorted_locs[:5]):
                lines.append(f"{i+1}. **{loc}**: {count} complaints")
            return "\n".join(lines)
            
        # 4. Department Statistics
        elif report_data and any(k in msg for k in ["department", "dept"]):
            charts = report_data.get("charts_data", {})
            categories = charts.get("categories_breakdown", {})
            if not categories:
                return "No department statistics are available in this report."
            sorted_cats = sorted(categories.items(), key=lambda x: x[1], reverse=True)
            lines = ["**Department Load Breakdown**:\n"]
            for i, (dept, count) in enumerate(sorted_cats[:8]):
                lines.append(f"{i+1}. **{dept}**: {count} cases")
            return "\n".join(lines)
            
        # 5. Trends / Status
        elif report_data and any(k in msg for k in ["trend", "status", "progress"]):
            charts = report_data.get("charts_data", {})
            statuses = charts.get("status_breakdown", {})
            total = report_data.get("total_complaints", 0)
            if not statuses:
                return "No status breakdown trend is available."
            lines = [f"**Complaint Status Trends (Total: {total})**:\n"]
            for status, count in statuses.items():
                percentage = round((count / total) * 100, 1) if total else 0
                lines.append(f"- **{status}**: {count} ({percentage}%)")
            return "\n".join(lines)
            
        # 6. Priority Issues / Actions
        elif report_data and any(k in msg for k in ["priority", "action", "recommendation", "p1", "p2"]):
            actions = report_data.get("priority_actions", [])
            if not actions:
                return "No priority recommendations have been drafted for this dataset yet."
            lines = ["**AI Priority Intervention Actions**:\n"]
            for act in actions:
                lines.append(
                    f"⚠️ **P{act.get('priority')} - {act.get('title')}**\n"
                    f"  *Dept*: {act.get('department')}\n"
                    f"  *Action*: {act.get('recommended_action')}\n"
                    f"  *Impact*: {act.get('impact')}\n"
                )
            return "\n".join(lines)
            
        # 7. Clusters
        elif report_data and any(k in msg for k in ["cluster", "topic", "group"]):
            clusters = report_data.get("clusters", [])
            if not clusters:
                return "No semantic clusters were found in this dataset."
            lines = ["**Semantic Clusters & Recurring Themes**:\n"]
            for cls in clusters:
                lines.append(
                    f"📁 **{cls.get('topic_title')}**\n"
                    f"  *Count*: {cls.get('complaint_count')} cases ({cls.get('recurrence_percentage')}% recurrence)\n"
                    f"  *Root Cause*: {cls.get('detected_root_cause')}\n"
                )
            return "\n".join(lines)

        # Standard general queries fallback
        if any(k in msg for k in ["hi", "hello", "hey", "greet"]):
            return "Hello! I am the JanaManthan Decision Intelligence Assistant. How can I help you analyze grievances or draft policy briefs today?"
            
        elif "help" in msg:
            return (
                "You can ask me about:\n"
                "1. **Manthan Engine**: Details about our 10-step NLP/clustering pipeline.\n"
                "2. **Reports & PDFs**: How to download official, server-generated ReportLab PDFs.\n"
                "3. **Heatmap GIS**: Details on dynamic state-district risk scoring.\n"
                "4. **Root Cause**: Information on explainable AI (XAI) and priority actions."
            )
            
        elif any(k in msg for k in ["engine", "manthan", "pipeline", "analysis"]):
            return (
                "The Manthan Engine executes an end-to-end AI pipeline:\n"
                "- Ingests raw CSVs (with multi-encoding support).\n"
                "- Redacts citizen PII.\n"
                "- Clusters complaints using TF-IDF + K-Means.\n"
                "- Drafts policy briefs using local (Qwen/Gemma) or cloud LLMs."
            )
            
        elif any(k in msg for k in ["pdf", "download", "report", "brief"]):
            return "To download an official report, go to the 'Reports' or 'Policy Briefs' tab and click the 'Download PDF' button. PDFs are generated server-side using ReportLab."
            
        elif any(k in msg for k in ["heatmap", "state", "district", "gis"]):
            return "The India Heatmap page displays grievance density across 25+ states. You can filter by state to dynamically load specific districts, risk levels, and top departments."
            
        elif any(k in msg for k in ["root cause", "rca", "xai"]):
            return "Root Cause Analysis (RCA) breaks down systemic failures into actionable insights. It lists priority actions (P1/P2/P3) and target departments to guide decision-makers."
            
        else:
            return "I'm here to assist with JanaManthan platform operations. For deep policy insights, please run the Manthan Engine or check the generated Policy Briefs."
