from app.database import SessionLocal, engine
from app import models, auth

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

user = models.User(
    username="michael",
    hashed_password=auth.get_password_hash("mr.robot00"),
    is_admin=True
)

db.add(user)
db.commit()
print("Admin user created successfully!")
db.close()