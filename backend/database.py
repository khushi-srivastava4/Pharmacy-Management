from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


import os

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# db_path = os.path.join(BASE_DIR, "pharmacy.db")

# DATABASE_URL = f"sqlite:///{db_path}"
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:////tmp/pharmacy.db"
)
engine= create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal=sessionmaker(bind= engine)
Base= declarative_base()