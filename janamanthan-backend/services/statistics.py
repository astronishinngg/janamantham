from typing import List, Dict, Any
from models.complaint import Complaint
from schemas.report import CategoryStat, LocationStat, ChartsData
from utils.logger import logger

class StatisticsService:
    @staticmethod
    def compute_statistics(complaints: List[Complaint]) -> Dict[str, Any]:
        """Calculates detailed quantitative statistics for dataset."""
        total = len(complaints)
        if total == 0:
            return {
                "total": 0,
                "categories": [],
                "locations": [],
                "status_breakdown": {},
                "charts_data": ChartsData(categories_breakdown={}, locations_breakdown={}, status_breakdown={})
            }
            
        # Category breakdown
        cat_counts: Dict[str, int] = {}
        cat_days: Dict[str, List[float]] = {}
        
        for c in complaints:
            cat = c.category or "Uncategorized"
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
            if c.resolution_days is not None and c.resolution_days > 0:
                cat_days.setdefault(cat, []).append(c.resolution_days)
                
        category_stats: List[CategoryStat] = []
        for cat, cnt in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
            pct = round((cnt / total) * 100, 1)
            days_list = cat_days.get(cat, [])
            avg_days = round(sum(days_list) / len(days_list), 1) if days_list else 0.0
            category_stats.append(CategoryStat(
                category=cat,
                count=cnt,
                percentage=pct,
                avg_resolution_days=avg_days
            ))
            
        # Location breakdown
        loc_counts: Dict[str, int] = {}
        for c in complaints:
            loc = c.location or "Unknown Location"
            loc_counts[loc] = loc_counts.get(loc, 0) + 1
            
        location_stats: List[LocationStat] = []
        for loc, cnt in sorted(loc_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            pct = round((cnt / total) * 100, 1)
            location_stats.append(LocationStat(
                location=loc,
                count=cnt,
                percentage=pct
            ))
            
        # Status breakdown
        status_counts: Dict[str, int] = {}
        for c in complaints:
            st = c.status or "Open"
            status_counts[st] = status_counts.get(st, 0) + 1
            
        charts_data = ChartsData(
            categories_breakdown=cat_counts,
            locations_breakdown=dict(sorted(loc_counts.items(), key=lambda x: x[1], reverse=True)[:6]),
            status_breakdown=status_counts
        )
        
        logger.info(f"Computed stats: Total={total}, Top Cat={category_stats[0].category if category_stats else 'None'}")
        
        return {
            "total": total,
            "category_stats": category_stats,
            "top_locations": location_stats,
            "status_counts": status_counts,
            "charts_data": charts_data
        }
