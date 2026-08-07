import numpy as np
from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from models.complaint import Complaint
from schemas.report import ClusterStat
from utils.logger import logger

class ClusteringService:
    @staticmethod
    def cluster_complaints(complaints: List[Complaint], max_clusters: int = 5) -> List[ClusterStat]:
        """Groups similar complaints using TF-IDF + K-Means clustering."""
        if not complaints or len(complaints) < 3:
            return []
            
        texts = [c.cleaned_text for c in complaints if c.cleaned_text]
        if len(texts) < 3:
            return []
            
        num_clusters = min(max_clusters, max(2, len(texts) // 4))
        
        try:
            vectorizer = TfidfVectorizer(max_features=500, stop_words='english', ngram_range=(1, 2))
            X = vectorizer.fit_transform(texts)
            
            kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
            cluster_labels = kmeans.fit_predict(X)
            
            # Assign cluster labels to complaints
            for idx, c in enumerate(complaints):
                if idx < len(cluster_labels):
                    c.cluster_id = int(cluster_labels[idx])
                    
            feature_names = vectorizer.get_feature_names_out()
            cluster_centers = kmeans.cluster_centers_
            
            clusters_stat: List[ClusterStat] = []
            
            for i in range(num_clusters):
                cluster_indices = [idx for idx, label in enumerate(cluster_labels) if label == i]
                cluster_comps = [complaints[idx] for idx in cluster_indices]
                
                if not cluster_comps:
                    continue
                    
                # Extract top TF-IDF keywords for topic title
                top_centroids = cluster_centers[i].argsort()[-4:][::-1]
                top_words = [feature_names[ind] for ind in top_centroids if cluster_centers[i][ind] > 0]
                
                topic_title = " / ".join([w.title() for w in top_words]) if top_words else f"Issue Group {i+1}"
                
                # Dominant category in cluster
                cat_counts = {}
                for comp in cluster_comps:
                    cat_counts[comp.category] = cat_counts.get(comp.category, 0) + 1
                dominant_cat = max(cat_counts, key=cat_counts.get) if cat_counts else "General Civic Issue"
                
                # Sample complaints
                sample_texts = [comp.description for comp in cluster_comps[:3]]
                
                # Calculate recurrence percentage
                recurrence_pct = round((len(cluster_comps) / len(complaints)) * 100, 1)
                
                # Infer simple root cause
                root_cause = f"Systemic recurring problem related to {topic_title.lower()} causing repeated citizen dissatisfaction."
                
                cluster_stat = ClusterStat(
                    cluster_id=i,
                    topic_title=topic_title,
                    category=dominant_cat,
                    complaint_count=len(cluster_comps),
                    recurrence_percentage=recurrence_pct,
                    sample_complaints=sample_texts,
                    detected_root_cause=root_cause
                )
                clusters_stat.append(cluster_stat)
                
            # Sort by complaint count descending
            clusters_stat.sort(key=lambda x: x.complaint_count, reverse=True)
            logger.info(f"Clustering complete. Formed {len(clusters_stat)} issue clusters.")
            return clusters_stat

        except Exception as e:
            logger.error(f"Error during complaint clustering: {e}")
            return []
