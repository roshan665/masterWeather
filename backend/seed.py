#!/usr/bin/env python
"""
PanchayatMausam AI Database Seeding & Verification CLI Tool
Usage:
    python seed.py               # Seed database with Phanda initial dataset if empty
    python seed.py --force       # Force reset and re-seed all tables with verified data
    python seed.py --check       # Verify database integrity, table counts, and model registry
"""

import sys
import os
import argparse

# Ensure backend root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.db.seeds import seed_database_if_empty
from app.models.panchayat import PanchayatModel
from app.models.crop import CropModel, CropStageModel
from app.models.user import UserModel
from app.models.weather import WeatherReadingModel
from app.models.advisory import AdvisoryRuleModel, AgrometAdvisoryModel
from app.models.ml_models import MLModelRegistryModel
from app.models.alert import WeatherAlertModel
from app.models.observation import FarmerObservationModel
from app.models.feedback import FeedbackSubmissionModel

def check_database_status(db):
    print("=" * 60)
    print("PanchayatMausam AI — Database Integrity Report")
    print("=" * 60)
    
    tables = [
        ("Gram Panchayats", PanchayatModel),
        ("Crops Registered", CropModel),
        ("Crop Growth Stages", CropStageModel),
        ("User Accounts", UserModel),
        ("Weather Telemetry Readings", WeatherReadingModel),
        ("Advisory Knowledge Base Rules", AdvisoryRuleModel),
        ("Agromet Advisories", AgrometAdvisoryModel),
        ("ML Model Registry", MLModelRegistryModel),
        ("Weather Alerts", WeatherAlertModel),
        ("Farmer Observations", FarmerObservationModel),
        ("Farmer Feedback Submissions", FeedbackSubmissionModel),
    ]

    total_records = 0
    for label, model in tables:
        count = db.query(model).count()
        total_records += count
        status = "[OK]" if count > 0 else "[EMPTY]"
        print(f" {status:<8} {label:<35}: {count} records")

    print("-" * 60)
    print(f" Total Records Persisted: {total_records}")
    print("=" * 60)
    return total_records

def main():
    parser = argparse.ArgumentParser(description="PanchayatMausam AI Database Seeder")
    parser.add_argument("--force", action="store_true", help="Drop all tables and re-seed cleanly")
    parser.add_argument("--check", action="store_true", help="Check database status without modifying")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        if args.check:
            check_database_status(db)
            return

        if args.force:
            print("[RESET] Dropping existing database schema...")
            Base.metadata.drop_all(bind=engine)
            print("[SCHEMA] Recreating database tables...")
            Base.metadata.create_all(bind=engine)
            print("[SEEDING] Seeding complete Phanda baseline dataset...")
            seed_database_if_empty(db)
            print("[SUCCESS] Database cleanly re-seeded!")
            check_database_status(db)
        else:
            print("[INIT] Ensuring database tables exist...")
            Base.metadata.create_all(bind=engine)
            print("[SEEDING] Checking and seeding database if empty...")
            seed_database_if_empty(db)
            check_database_status(db)
    finally:
        db.close()

if __name__ == "__main__":
    main()
