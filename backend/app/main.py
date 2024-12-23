# main.py
from flask import Flask, json, request, jsonify
from flask_cors import CORS
from schemas import NonConformity
from database import SessionLocal, engine
from datetime import datetime
import models
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Habilita CORS para todas las rutas
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
    data = request.form['data']  # Obtener los datos del formulario
    images = request.files.getlist('images')  # Obtener todas las imágenes
    if not data:
        return {"error": "No se recibieron datos en la solicitud"}, 400
    
    try:
        ticket_data = json.loads(data)
    except json.JSONDecodeError:
        return {"error": "Error al decodificar datos JSON"}, 400
    
    print("Datos del formulario recibidos:", ticket_data)
    print("Número de imágenes recibidas:", len(images))
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
            description=ticket.description,
        )
        print("Datos del ticket a insertar:", db_ticket.__dict__)
        try:
            db.add(db_ticket)
            db.commit()
            db.refresh(db_ticket)

            # Guardar las imágenes
            for image in images:
                db_image = models.NCTicketImage(
                    ticket_id=db_ticket.id,
                    image=image.read()
                )
                db.add(db_image)

            db.commit()
            ticket_id = db_ticket.id  # Asumiendo que el modelo tiene un atributo 'id'
            return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
        except Exception as e:
            logging.exception("Error creating ticket: %s", e)
            return jsonify({"error": "Error creating ticket"}), 500