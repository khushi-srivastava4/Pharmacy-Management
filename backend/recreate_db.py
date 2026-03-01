"""
Script to recreate the database with the correct schema.
WARNING: This will delete all existing data!
"""
import os
from database import Base, engine

# Delete existing database
db_file = "pharmacy.db"
if os.path.exists(db_file):
    os.remove(db_file)
    print(f"Deleted existing {db_file}")

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database recreated successfully with correct schema!")
