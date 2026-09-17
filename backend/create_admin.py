import os

from dotenv import load_dotenv

from backend.app.database import SessionLocal, engine
from backend.app import auth, models

load_dotenv()

username = os.getenv("ADMIN_USERNAME")
password = os.getenv("ADMIN_PASSWORD")

if not username or not password:
    raise RuntimeError("ADMIN_USERNAME and ADMIN_PASSWORD must be set")

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    existing = db.query(models.User).filter(models.User.username == username).first()

    if existing:
        existing.hashed_password = auth.get_password_hash(password)
        existing.is_admin = True
        db.commit()
        print(f"Admin user '{username}' updated successfully.")
    else:
        user = models.User(
            username=username,
            hashed_password=auth.get_password_hash(password),
            is_admin=True,
        )
        db.add(user)
        db.commit()
        print(f"Admin user '{username}' created successfully.")
finally:
    db.close()
