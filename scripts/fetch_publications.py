#!/usr/bin/env python3
"""
Fetch publications from Google Scholar for Francesco Guerra (A68h4-8AAAAJ)
and update src/data/publications.json.

Usage:
    pip install scholarly
    python scripts/fetch_publications.py
"""

import json
import os
import sys
import time
import re
from pathlib import Path

try:
    from scholarly import scholarly
except ImportError:
    print("ERROR: 'scholarly' package not found. Run: pip install scholarly")
    sys.exit(1)

SCHOLAR_USER_ID = os.environ.get("SCHOLAR_USER_ID", "A68h4-8AAAAJ")
OUTPUT_FILE = Path(__file__).parent.parent / "src" / "data" / "publications.json"

KEYWORD_TAGS = {
    "entity match": "Entity Matching",
    "entity resolution": "Entity Matching",
    "record linkage": "Entity Matching",
    "deduplication": "Entity Matching",
    "data integration": "Data Integration",
    "data fusion": "Data Integration",
    "knowledge graph": "Knowledge Graphs",
    "ontology": "Knowledge Graphs",
    "semantic": "Semantic Web",
    "nlp": "NLP",
    "natural language": "NLP",
    "text": "NLP",
    "language model": "NLP",
    "bert": "NLP",
    "transformer": "NLP",
    "time series": "Time Series",
    "anomaly": "Anomaly Detection",
    "novelty detection": "Anomaly Detection",
    "autoencoder": "Anomaly Detection",
    "fact": "Fact Verification",
    "esg": "ESG",
    "database": "Database Systems",
    "sql": "Database Systems",
    "query": "Database Systems",
    "big data": "Big Data",
    "machine learning": "Machine Learning",
    "deep learning": "Machine Learning",
    "clustering": "Machine Learning",
}


def infer_tags(title: str, abstract: str = "") -> list[str]:
    combined = (title + " " + abstract).lower()
    found = set()
    for keyword, tag in KEYWORD_TAGS.items():
        if keyword in combined:
            found.add(tag)
    return sorted(found)


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60]


def fetch_publications() -> list[dict]:
    print(f"Fetching publications for Scholar ID: {SCHOLAR_USER_ID}")

    author = scholarly.search_author_id(SCHOLAR_USER_ID)
    print(f"Found author: {author.get('name', 'Unknown')}")

    author_filled = scholarly.fill(author, sections=["publications"])
    raw_pubs = author_filled.get("publications", [])
    print(f"Found {len(raw_pubs)} publications. Fetching details...")

    publications = []
    for i, pub_stub in enumerate(raw_pubs):
        try:
            pub = scholarly.fill(pub_stub)
            bib = pub.get("bib", {})
            title = bib.get("title", "")
            if not title:
                continue

            year_raw = bib.get("pub_year") or bib.get("year") or 0
            year = int(year_raw) if str(year_raw).isdigit() else 0

            authors_raw = bib.get("author", "")
            if isinstance(authors_raw, str):
                authors = [a.strip() for a in authors_raw.split(" and ") if a.strip()]
            else:
                authors = list(authors_raw)

            venue = bib.get("journal") or bib.get("booktitle") or bib.get("conference") or ""
            abstract = bib.get("abstract", "") or ""
            citations = pub.get("num_citations", 0) or 0

            pub_id = slugify(title) + f"-{year}"
            tags = infer_tags(title, abstract)

            entry = {
                "id": pub_id,
                "title": title,
                "authors": authors,
                "venue": venue,
                "year": year,
                "citations": citations,
                "abstract": abstract[:500] if abstract else "",
                "doi": None,
                "url": pub.get("pub_url") or None,
                "tags": tags,
                "featured": False,
            }
            publications.append(entry)
            print(f"  [{i+1}/{len(raw_pubs)}] {title[:60]}... ({year})")

            # Be polite to Scholar
            time.sleep(1)

        except Exception as e:
            print(f"  WARNING: Failed to fetch pub {i+1}: {e}")
            continue

    # Sort by year descending
    publications.sort(key=lambda p: p["year"], reverse=True)
    return publications


def main():
    publications = fetch_publications()
    if not publications:
        print("WARNING: No publications found. Not overwriting existing file.")
        sys.exit(1)

    # Preserve 'featured' flags from existing data
    existing = {}
    if OUTPUT_FILE.exists():
        try:
            with open(OUTPUT_FILE) as f:
                existing_pubs = json.load(f)
            existing = {p["id"]: p for p in existing_pubs}
        except Exception:
            pass

    for pub in publications:
        if pub["id"] in existing:
            pub["featured"] = existing[pub["id"]].get("featured", False)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(publications, f, indent=2, ensure_ascii=False)

    print(f"\nSaved {len(publications)} publications to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
