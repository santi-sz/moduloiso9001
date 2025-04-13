# main.py
from flask import Flask, json, request, jsonify, send_from_directory
from flask_cors import CORS
from schemas import NonConformity
from database import SessionLocal, engine
from datetime import datetime
import models
import logging
import os
import uuid
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Habilita CORS para todas las rutas

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Asegúrate de que la carpeta de subidas exista
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

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
    
    #print("Datos del formulario recibidos:", ticket_data)
    # print("Número de imágenes recibidas:", len(images))
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
        # print("Datos del ticket a insertar:", db_ticket.__dict__)
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
        
@app.get("/get-tickets")
def get_tickets():
    """ Devuelve todos los tickets en formato de lista de diccionarios """
    with next(get_db()) as db:
        try:
            tickets = db.query(models.NCTicket).all()
            print("Tickets obtenidos:", tickets)
            tickets_dict = []
            for ticket in tickets:
                ticket_dict = ticket.__dict__.copy()
                ticket_dict.pop('_sa_instance_state', None)  # Excluir el atributo _sa_instance_state
                tickets_dict.append(ticket_dict)
            return jsonify(tickets_dict)
        except Exception as e:
            logging.exception("Error al obtener los tickets: %s", e)
            return jsonify({"error": "Error al obtener los tickets"}), 500

# Endpoints para los analisis de causas
from sqlalchemy.exc import IntegrityError

@app.route('/cause-analysis', methods=['POST'])
def create_cause_analysis():
    data = request.json

    with next(get_db()) as db:
        try:
            new_analysis = models.CauseAnalysis(
                ticket_id=data.get('ticket_id'),
                date_analysis=datetime.strptime(data.get('date_analysis'), '%Y-%m-%dT%H:%M:%S') if data.get('date_analysis') else datetime.now(),
                problem=data.get('problem'),
                suggestion=data.get('suggestion'),
                section=data.get('section'),
                user=data.get('user'),
                date_ticket=datetime.strptime(data.get('date_ticket'), '%Y-%m-%dT%H:%M:%S') if data.get('date_ticket') else None,
                assistants=data.get('assistants'),
                definition=data.get('definition'),
                cause1=data.get('cause1'),
                cause2=data.get('cause2'),
                cause3=data.get('cause3'),
                cause4=data.get('cause4'),
                cause5=data.get('cause5'),
                cause6=data.get('cause6'),
                cause_origin=data.get('cause_origin'),
                proposed_solution=data.get('proposed_solution'),
                gravedad=data.get('gravedad'),
                costo_oportunidad=data.get('costo_oportunidad')
            )

            db.add(new_analysis)
            db.commit()
            db.refresh(new_analysis)

            return jsonify({
                'id': new_analysis.id,
                'ticket_id': new_analysis.ticket_id,
                'date_analysis': new_analysis.date_analysis.isoformat() if new_analysis.date_analysis else None,
                'problem': new_analysis.problem,
                'suggestion': new_analysis.suggestion,
                'section': new_analysis.section,
                'user': new_analysis.user,
                'proposed_solution': new_analysis.proposed_solution,
            }), 201

        except IntegrityError as e:
            db.rollback()
            return jsonify({"error": "El ticket_id proporcionado no existe o es invalido"}), 400
        except Exception as e:
            db.rollback()
            return jsonify({"error": "Error al crear el analisis de causa"}), 500


@app.route('/cause-analysis/<int:analysis_id>', methods=['GET'])
def get_cause_analysis(analysis_id):
    with next(get_db()) as db:
        analysis = db.query(models.CauseAnalysis).filter_by(id=analysis_id).first()
        if not analysis:
            return jsonify({"error": "Análisis no encontrado"}), 404

        # Serializar recursos
        resources = [
            {
                'id': resource.id,
                'tipo': resource.tipo,
                'unidad_medida': resource.unidad_medida,
                'cantidad': resource.cantidad,
                'precio': resource.precio,
                'total_estimado': resource.total_estimado,
                'proveedor_1': resource.proveedor_1,
                'proveedor_2': resource.proveedor_2
            }
            for resource in analysis.resources
        ]

        # Serializar archivos
        archivos = [
            {
                'id': archivo.id,
                'nombre': archivo.nombre,
                'tipo_archivo': archivo.tipo_archivo,
                'extension': archivo.extension,
                'tamano_bytes': archivo.tamano_bytes,
                'fecha_subida': archivo.fecha_subida.isoformat()
            }
            for archivo in analysis.archivos
        ]

        # Serializar la respuesta completa
        return jsonify({
            'id': analysis.id,
            'ticket_id': analysis.ticket_id,
            'date_analysis': analysis.date_analysis.isoformat() if analysis.date_analysis else None,
            'problem': analysis.problem,
            'suggestion': analysis.suggestion,
            'section': analysis.section,
            'user': analysis.user,
            'date_ticket': analysis.date_ticket.isoformat() if analysis.date_ticket else None,
            'assistants': analysis.assistants,
            'definition': analysis.definition,
            'cause1': analysis.cause1,
            'cause2': analysis.cause2,
            'cause3': analysis.cause3,
            'cause4': analysis.cause4,
            'cause5': analysis.cause5,
            'cause6': analysis.cause6,
            'cause_origin': analysis.cause_origin,
            'proposed_solution': analysis.proposed_solution,
            'gravedad': analysis.gravedad,
            'costo_oportunidad': analysis.costo_oportunidad,
            'resources': resources,
            'archivos': archivos
        })


@app.route('/cause-analysis', methods=['GET'])
def get_all_cause_analyses():
    with next(get_db()) as db:
        analyses = db.query(models.CauseAnalysis).all()
        result = [
            {
                'id': analysis.id,
                'ticket_id': analysis.ticket_id,
                'date_analysis': analysis.date_analysis.isoformat() if analysis.date_analysis else None,
                'problem': analysis.problem,
                'proposed_solution': analysis.proposed_solution
            }
            for analysis in analyses
        ]

        return jsonify(result)


@app.route('/cause-analysis/<int:analysis_id>', methods=['PUT'])
def update_cause_analysis(analysis_id):
    data = request.json

    with next(get_db()) as db:
        analysis = db.query(models.CauseAnalysis).filter_by(id=analysis_id).first()
        if not analysis:
            return jsonify({"error": "Análisis no encontrado"}), 404

        # Actualizar campos
        if 'ticket_id' in data:
            analysis.ticket_id = data['ticket_id']
        if 'problem' in data:
            analysis.problem = data['problem']
        if 'suggestion' in data:
            analysis.suggestion = data['suggestion']
        if 'section' in data:
            analysis.section = data['section']
        if 'user' in data:
            analysis.user = data['user']
        if 'date_ticket' in data and data['date_ticket']:
            analysis.date_ticket = datetime.strptime(data['date_ticket'], '%Y-%m-%dT%H:%M:%S')
        if 'assistants' in data:
            analysis.assistants = data['assistants']
        if 'definition' in data:
            analysis.definition = data['definition']
        if 'cause1' in data:
            analysis.cause1 = data['cause1']
        if 'cause2' in data:
            analysis.cause2 = data['cause2']
        if 'cause3' in data:
            analysis.cause3 = data['cause3']
        if 'cause4' in data:
            analysis.cause4 = data['cause4']
        if 'cause5' in data:
            analysis.cause5 = data['cause5']
        if 'cause6' in data:
            analysis.cause6 = data['cause6']
        if 'cause_origin' in data:
            analysis.cause_origin = data['cause_origin']
        if 'proposed_solution' in data:
            analysis.proposed_solution = data['proposed_solution']
        if 'gravedad' in data:
            analysis.gravedad = data['gravedad']
        if 'costo_oportunidad' in data:
            analysis.costo_oportunidad = data['costo_oportunidad']

        db.commit()

        return jsonify({'message': 'Análisis actualizado correctamente'})


@app.route('/cause-analysis/<int:analysis_id>', methods=['DELETE'])
def delete_cause_analysis(analysis_id):
    with next(get_db()) as db:
        analysis = db.query(models.CauseAnalysis).filter_by(id=analysis_id).first()
        if not analysis:
            return jsonify({"error": "Análisis no encontrado"}), 404

        # Eliminar archivos físicos
        for archivo in analysis.archivos:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], archivo.nombre_almacenado)
            if os.path.exists(file_path):
                os.remove(file_path)

        db.delete(analysis)
        db.commit()

        return jsonify({'message': 'Análisis eliminado correctamente'})
    

# //////////////////////// Files endpoints ////////////////////
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/cause-analysis/<int:analysis_id>/file', methods=['POST'])
def upload_file(analysis_id):
    with next(get_db()) as db:
        try:
            analysis = db.query(models.CauseAnalysis).filter_by(id=analysis_id).first()
            if not analysis:
                return jsonify({"error": "Análisis no encontrado"}), 404

            if 'file' not in request.files:
                return jsonify({'error': 'No se encontró el archivo en la solicitud'}), 400

            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No se seleccionó ningún archivo'}), 400

            if file and allowed_file(file.filename):
                # Crear nombre único para el archivo
                original_filename = secure_filename(file.filename)
                extension = original_filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{extension}"

                # Guardar el archivo
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)

                # Determinar tipo de archivo
                if extension == 'pdf':
                    tipo = "pdf"
                elif extension in ['jpg', 'jpeg', 'png', 'gif']:
                    tipo = "imagen"
                elif extension in ['doc', 'docx', 'xls', 'xlsx']:
                    tipo = "documento"
                else:
                    tipo = "otro"

                # Crear registro en la base de datos
                new_file = models.Archivo(
                    analisis_id=analysis_id,
                    nombre=original_filename,
                    nombre_almacenado=unique_filename,
                    ruta_relativa=f"{app.config['UPLOAD_FOLDER']}/{unique_filename}",
                    tipo_archivo=tipo,
                    extension=extension,
                    tamano_bytes=os.path.getsize(file_path)
                )

                db.add(new_file)
                db.commit()
                db.refresh(new_file)

                return jsonify({
                    'id': new_file.id,
                    'nombre': new_file.nombre,
                    'tipo': new_file.tipo_archivo,
                    'tamano': new_file.tamano_bytes
                }), 201

            return jsonify({'error': 'Tipo de archivo no permitido'}), 400
        except Exception as e:
            db.rollback()
            print(e)
            return jsonify({"error": "Error al subir el archivo"}), 500


@app.route('/cause-analysis/<int:analysis_id>/file', methods=['GET'])
def list_files(analysis_id):
    with next(get_db()) as db:
        try:
            analysis = db.query(models.CauseAnalysis).filter_by(id=analysis_id).first()
            if not analysis:
                return jsonify({"error": "Análisis no encontrado"}), 404

            result = []
            for archivo in analysis.archivos:
                result.append({
                    'id': archivo.id,
                    'analisis_id': archivo.analisis_id,
                    'nombre': archivo.nombre,
                    'tipo_archivo': archivo.tipo_archivo,
                    'extension': archivo.extension,
                    'tamano_bytes': archivo.tamano_bytes,
                    'fecha_subida': archivo.fecha_subida.isoformat()
                })

            return jsonify(result)
        except Exception as e:
            return jsonify({"error": "Error al listar los archivos"}), 500


@app.route('/file/<int:file_id>', methods=['GET'])
def download_file(file_id):
    with next(get_db()) as db:
        try:
            archivo = db.query(models.Archivo).filter_by(id=file_id).first()
            if not archivo:
                return jsonify({"error": "Archivo no encontrado"}), 404

            # Extraer el nombre del archivo almacenado
            nombre_almacenado = archivo.nombre_almacenado

            return send_from_directory(
                app.config['UPLOAD_FOLDER'],
                nombre_almacenado,
                as_attachment=True,
                download_name=archivo.nombre
            )
        except Exception as e:
            return jsonify({"error": "Error al descargar el archivo"}), 500


@app.route('/file/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    with next(get_db()) as db:
        try:
            archivo = db.query(models.Archivo).filter_by(id=file_id).first()
            if not archivo:
                return jsonify({"error": "Archivo no encontrado"}), 404

            # Eliminar el archivo físico
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], archivo.nombre_almacenado)
            if os.path.exists(file_path):
                os.remove(file_path)

            db.delete(archivo)
            db.commit()

            return jsonify({'message': 'Archivo eliminado correctamente'})
        except Exception as e:
            db.rollback()
            return jsonify({"error": "Error al eliminar el archivo"}), 500