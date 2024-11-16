from flask import Flask, request, jsonify
from flask_cors import CORS
from schemas import NonConformity
from database import SessionLocal, engine
from datetime import datetime
import models
import logging

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas
models.Base.metadata.create_all(bind=engine)

def delete_db():
    models.Base.metadata.drop_all(bind=engine)
    logging.info("Database deleted")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/create-ticket")
def create_ticket():
    actual_date = datetime.now()
    ticket_data = request.get_json()
    try:
        ticket = NonConformity(**ticket_data)
    except ValueError as e:
        return jsonify({"Invalid input error": str(e)}), 400

    with next(get_db()) as db:
        db_ticket = models.NCTicket(
            date=actual_date,
            user_name=ticket.user_name,
            section=ticket.section,
            sub_section=ticket.sub_section,
            detection_way=ticket.detection_way,
            base_type=ticket.base_type,
            origin_type=ticket.origin_type,
            batch=ticket.batch,
            resources_product=",".join(ticket.resources_product),
            attributes_product=",".join(ticket.attributes_product),
            nc_products=ticket.nc_products,
            result_products=ticket.result_products,
            process=ticket.process,
            attributes_process=",".join(ticket.attributes_process),
            nc_process=ticket.nc_process,
            action=ticket.action,
            description=ticket.description
        )
        try:
            db.add(db_ticket)
            db.commit()
            ticket_id = db_ticket.id  # Asumiendo que el modelo tiene un atributo 'id'
            return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
        except Exception as e:
            logging.exception("Error creating ticket: %s", e)
            return jsonify({"error": "Error creating ticket"}), 500
        
    print("Ticket created successfully")