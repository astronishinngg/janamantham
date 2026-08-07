import csv
import random
from pathlib import Path

sample_path = Path(__file__).resolve().parent / "sample_grievances.csv"
sample_path.parent.mkdir(parents=True, exist_ok=True)

categories_issues = {
    "Water & Sanitation": [
        "Severe water pipe leakage near main market causing street flooding and low pressure.",
        "Contaminated drinking water with brown sediment coming out of tap in household.",
        "No water supply for last 3 days in Ward 12 residential block.",
        "Drainage overflow on main road resulting in stagnant dirty water and foul smell.",
        "Borewell pump broken near community park, residents stranded without water.",
        "Illegal water pipeline connection causing pressure drop across sector 4."
    ],
    "Roads & Infrastructure": [
        "Dangerous deep potholes on MG Road post-monsoon causing vehicle damage and traffic congestion.",
        "Unpaved dirt road causing massive dust pollution and difficulty for school buses.",
        "Broken concrete footpath near metro station creating risk for pedestrian injury.",
        "Street asphalt peeled off near bridge junction, needs immediate tarring.",
        "Damaged traffic light junction box causing signal blackout during peak hours.",
        "Road construction work left abandoned without warning barricades or signs."
    ],
    "Electricity & Power": [
        "Frequent unannounced power cuts during night hours lasting 4-5 hours.",
        "High voltage fluctuation damaging home electrical appliances in neighborhood.",
        "Sparking electrical transformer pole posing fire hazard near residential area.",
        "Streetlights not functioning on 5th Main street for past two weeks.",
        "Incorrect high billing amount issued due to faulty digital electricity meter.",
        "Hanging low overhead power line near school gate needs immediate tightening."
    ],
    "Waste & Sanitation": [
        "Unattended garbage bin overflowing for 5 days attracting stray dogs and flies.",
        "Door-to-door waste collection truck has not visited ward 8 since Monday.",
        "Open dumping of hotel food waste on empty plot creating health hazard.",
        "Public park littered with plastic bags and waste due to missing trash cans.",
        "Sanitation workers sweeping dirt directly into open storm water drains."
    ],
    "Public Transport & Traffic": [
        "City bus route 45 consistently running 40 minutes late during morning peak hours.",
        "Overcrowding and insufficient bus frequency during evening office rush hours.",
        "Bus stop shelter roof broken causing passengers to stand in heavy rain.",
        "Auto-rickshaws charging extra fare and refusing meter near railway station."
    ]
}

locations = [
    "Ward 12 (Central Market)", "Ward 4 (Indiranagar)", "Ward 8 (Station Road)", 
    "Ward 15 (North Extension)", "Ward 2 (Civil Lines)", "Ward 9 (Industrial Area)",
    "Ward 18 (Lakeview Colony)", "Ward 21 (West Suburbs)"
]

statuses = ["Open", "In Progress", "Resolved", "Pending Inspection"]

records = []
for i in range(1, 251):
    cat = random.choice(list(categories_issues.keys()))
    desc = random.choice(categories_issues[cat])
    loc = random.choice(locations)
    status = random.choices(statuses, weights=[0.4, 0.3, 0.2, 0.1])[0]
    res_days = round(random.uniform(1.5, 14.0), 1) if status in ["Resolved", "In Progress"] else random.randint(5, 25)
    date = f"2026-07-{random.randint(1, 31):02d}"
    
    records.append({
        "Grievance_ID": f"GRV-{2026000 + i}",
        "Department": cat,
        "Location": loc,
        "Date": date,
        "Description": desc,
        "Status": status,
        "Resolution_Days": res_days
    })

with open(sample_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["Grievance_ID", "Department", "Location", "Date", "Description", "Status", "Resolution_Days"])
    writer.writeheader()
    writer.writerows(records)

print(f"Generated {len(records)} sample grievances in {sample_path}")
